const USERS_STORAGE_KEY = 'nexus.users'
const SESSION_STORAGE_KEY = 'nexus.auth.session.v1'
const LEGACY_SESSION_STORAGE_KEY = 'nexus.auth.v1'
const CURRENT_USER_STORAGE_KEY = 'nexus.currentUser'
const SETTINGS_STORAGE_KEY = 'nexus.settings'
const OAUTH_POPUP_FEATURES = 'popup=yes,width=520,height=720,menubar=no,toolbar=no,location=yes,status=no'

type AuthProvider = 'email' | 'google' | 'vk' | 'yandex'

export type NexusUserProfile = {
  avatar: string
  bio: string
  displayName: string
  email: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  username: string
}

export type NexusUser = NexusUserProfile & {
  createdAt: string
  firstName?: string
  id: string
  lastName?: string
  provider: AuthProvider
  providerId?: string
  updatedAt: string
}

export type NexusSessionSettings = {
  locale: string
  notifications: boolean
  theme: 'dark'
}

export type NexusAuthSession = {
  currentUser: NexusUser
  settings: NexusSessionSettings
  token: string
}

export type RegisterInput = {
  confirmPassword: string
  email: string
  firstName: string
  lastName: string
  password: string
  username: string
}

export type LoginInput = {
  login: string
  password: string
}

type StoredUser = NexusUser & {
  passwordHash?: string
}

type GoogleUserInfo = {
  email?: string
  id?: string
  name?: string
  picture?: string
  sub?: string
}

type YandexUserInfo = {
  default_avatar_id?: string
  default_email?: string
  display_name?: string
  first_name?: string
  id: string
  last_name?: string
  login?: string
  real_name?: string
}

type VkUserInfo = {
  avatar?: string
  email?: string
  first_name?: string
  last_name?: string
  user_id: string
}

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function createId(prefix: string) {
  const random = crypto.getRandomValues(new Uint32Array(3))
  return `${prefix}_${Array.from(random).map((item) => item.toString(36)).join('')}`
}

function createToken(userId: string) {
  return `nexus_${userId}_${createId('token')}`
}

function base64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function createPkcePair() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(48))
  const verifier = base64Url(verifierBytes.buffer)
  const challengeBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))

  return {
    challenge: base64Url(challengeBuffer),
    verifier,
  }
}

function getUsers() {
  return safeRead<StoredUser[]>(USERS_STORAGE_KEY, [])
}

function saveUsers(users: StoredUser[]) {
  writeJson(USERS_STORAGE_KEY, users)
}

function publicUser(user: StoredUser): NexusUser {
  const safeUser = { ...user }
  delete safeUser.passwordHash
  return safeUser
}

function createDefaultSettings(): NexusSessionSettings {
  return {
    locale: 'ru-RU',
    notifications: true,
    theme: 'dark',
  }
}

function saveSession(user: StoredUser): NexusAuthSession {
  const session: NexusAuthSession = {
    currentUser: publicUser(user),
    settings: createDefaultSettings(),
    token: createToken(user.id),
  }

  writeJson(SESSION_STORAGE_KEY, session)
  writeJson(CURRENT_USER_STORAGE_KEY, session.currentUser)
  writeJson(SETTINGS_STORAGE_KEY, session.settings)
  window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY)
  return session
}

function assertPassword(password: string, confirmPassword?: string) {
  if (password.length < 8) {
    throw new AuthError('Пароль должен быть минимум 8 символов.')
  }

  if (!/\d/.test(password)) {
    throw new AuthError('Пароль должен содержать минимум одну цифру.')
  }

  if (!/[a-zа-яё]/i.test(password)) {
    throw new AuthError('Пароль должен содержать минимум одну букву.')
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new AuthError('Пароли не совпадают.')
  }
}

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function ensureRequired(value: string, message: string) {
  if (!value.trim()) {
    throw new AuthError(message)
  }
}

function initials(firstName?: string, lastName?: string, fallback = 'NX') {
  const value = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim()
  return (value || fallback.slice(0, 2)).toUpperCase()
}

function createUser(input: {
  avatar?: string
  email: string
  firstName?: string
  lastName?: string
  passwordHash?: string
  provider: AuthProvider
  providerId?: string
  username: string
}) {
  const now = new Date().toISOString()
  const displayName = `${input.firstName ?? ''} ${input.lastName ?? ''}`.trim() || input.username

  return {
    avatar: input.avatar || initials(input.firstName, input.lastName, input.username),
    bio: '',
    createdAt: now,
    displayName,
    email: normalizeEmail(input.email),
    firstName: input.firstName?.trim(),
    id: createId('usr'),
    lastName: input.lastName?.trim(),
    passwordHash: input.passwordHash,
    provider: input.provider,
    providerId: input.providerId,
    status: 'online' as const,
    updatedAt: now,
    username: normalizeUsername(input.username),
  } satisfies StoredUser
}

function createUniqueUsername(base: string, users: StoredUser[]) {
  const normalizedBase = normalizeUsername(base) || 'user'
  let candidate = normalizedBase
  let index = 1

  while (users.some((user) => user.username === candidate)) {
    index += 1
    candidate = `${normalizedBase}-${index}`
  }

  return candidate
}

function providerEmail(provider: AuthProvider, providerId: string, email?: string) {
  return normalizeEmail(email || `${provider}-${providerId}@oauth.nexus.local`)
}

function getClientId(provider: 'google' | 'vk' | 'yandex') {
  const keys = {
    google: 'VITE_GOOGLE_CLIENT_ID',
    vk: 'VITE_VK_CLIENT_ID',
    yandex: 'VITE_YANDEX_CLIENT_ID',
  } as const
  const value = import.meta.env[keys[provider]]

  if (!value) {
    throw new AuthError(`Не настроен ${keys[provider]}. Добавьте client_id OAuth-провайдера в .env.`)
  }

  return String(value)
}

function getRedirectUri(provider: 'google' | 'vk' | 'yandex') {
  const configured = import.meta.env.VITE_OAUTH_REDIRECT_URI
  if (configured) {
    return String(configured)
  }

  const url = new URL(window.location.href)
  return `${url.origin}${url.pathname}?oauth_provider=${provider}`
}

function parseOAuthResponse(url: string) {
  const parsed = new URL(url)
  const params = new URLSearchParams(parsed.search)
  const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''))

  hashParams.forEach((value, key) => params.set(key, value))
  return params
}

function openOAuthPopup(authUrl: string, redirectUri: string, state: string) {
  const popup = window.open(authUrl, 'nexus-oauth', OAUTH_POPUP_FEATURES)

  if (!popup) {
    throw new AuthError('Браузер заблокировал OAuth-окно. Разрешите pop-up для Nexus.')
  }

  return new Promise<URLSearchParams>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.clearInterval(timer)
      popup.close()
      reject(new AuthError('Время входа истекло. Попробуйте еще раз.'))
    }, 120000)

    const timer = window.setInterval(() => {
      if (popup.closed) {
        window.clearTimeout(timeout)
        window.clearInterval(timer)
        reject(new AuthError('Вход был отменен.'))
        return
      }

      try {
        if (!popup.location.href.startsWith(redirectUri)) {
          return
        }

        const params = parseOAuthResponse(popup.location.href)
        const error = params.get('error')
        const returnedState = params.get('state')

        if (error) {
          throw new AuthError(params.get('error_description') || error)
        }

        if (returnedState !== state) {
          throw new AuthError('OAuth state не совпал. Повторите вход.')
        }

        window.clearTimeout(timeout)
        window.clearInterval(timer)
        popup.close()
        resolve(params)
      } catch (error) {
        if (error instanceof AuthError) {
          window.clearTimeout(timeout)
          window.clearInterval(timer)
          popup.close()
          reject(error)
        }
      }
    }, 350)
  })
}

async function requestOAuthToken(provider: 'google' | 'vk' | 'yandex', options: Record<string, string>) {
  const clientId = getClientId(provider)
  const redirectUri = getRedirectUri(provider)
  const state = createId('state')
  const url = new URL(options.authorizeUrl)

  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'token')
  url.searchParams.set('state', state)

  if (options.scope) {
    url.searchParams.set('scope', options.scope)
  }

  if (options.extra) {
    options.extra.split('&').forEach((pair) => {
      const [key, value] = pair.split('=')
      url.searchParams.set(key, value)
    })
  }

  const params = await openOAuthPopup(url.toString(), redirectUri, state)
  const accessToken = params.get('access_token')

  if (!accessToken) {
    throw new AuthError('OAuth-провайдер не вернул access_token.')
  }

  return accessToken
}

async function requestOAuthCode(provider: 'vk', options: Record<string, string>) {
  const clientId = getClientId(provider)
  const redirectUri = getRedirectUri(provider)
  const state = createId('state')
  const pkce = await createPkcePair()
  const url = new URL(options.authorizeUrl)

  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', pkce.challenge)
  url.searchParams.set('code_challenge_method', 'S256')

  if (options.scope) {
    url.searchParams.set('scope', options.scope)
  }

  const params = await openOAuthPopup(url.toString(), redirectUri, state)
  const code = params.get('code')

  if (!code) {
    throw new AuthError('VK ID не вернул authorization code.')
  }

  return {
    clientId,
    code,
    codeVerifier: pkce.verifier,
    deviceId: params.get('device_id') || '',
    redirectUri,
    state,
  }
}

async function fetchJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new AuthError(`OAuth API вернул ошибку ${response.status}.`)
  }

  return response.json() as Promise<T>
}

function upsertOAuthUser(input: {
  avatar?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  provider: Exclude<AuthProvider, 'email'>
  providerId: string
  username?: string
}) {
  const users = getUsers()
  const email = providerEmail(input.provider, input.providerId, input.email)
  const existingIndex = users.findIndex((user) => (
    (user.provider === input.provider && user.providerId === input.providerId)
    || user.email === email
  ))

  if (existingIndex >= 0) {
    const existing = users[existingIndex]
    const displayName = input.name || `${input.firstName ?? ''} ${input.lastName ?? ''}`.trim() || existing.displayName
    const updatedUser: StoredUser = {
      ...existing,
      avatar: input.avatar || existing.avatar,
      displayName,
      email,
      firstName: input.firstName || existing.firstName,
      lastName: input.lastName || existing.lastName,
      provider: input.provider,
      providerId: input.providerId,
      status: 'online',
      updatedAt: new Date().toISOString(),
    }

    users[existingIndex] = updatedUser
    saveUsers(users)
    return saveSession(updatedUser)
  }

  const nameParts = (input.name || '').split(' ').filter(Boolean)
  const firstName = input.firstName || nameParts[0] || input.username || input.provider
  const lastName = input.lastName || nameParts.slice(1).join(' ')
  const username = createUniqueUsername(input.username || email.split('@')[0] || `${input.provider}-${input.providerId}`, users)
  const user = createUser({
    avatar: input.avatar,
    email,
    firstName,
    lastName,
    provider: input.provider,
    providerId: input.providerId,
    username,
  })

  users.push(user)
  saveUsers(users)
  return saveSession(user)
}

export const authService = {
  async register(input: RegisterInput) {
    const email = normalizeEmail(input.email)
    const username = normalizeUsername(input.username)
    const firstName = input.firstName.trim()
    const lastName = input.lastName.trim()

    ensureRequired(firstName, 'Введите имя.')
    ensureRequired(lastName, 'Введите фамилию.')
    ensureRequired(username, 'Введите username.')
    ensureRequired(email, 'Введите email.')
    assertPassword(input.password, input.confirmPassword)

    const users = getUsers()

    if (users.some((user) => user.email === email)) {
      throw new AuthError('Email уже зарегистрирован.')
    }

    if (users.some((user) => user.username === username)) {
      throw new AuthError('Username уже занят.')
    }

    const user = createUser({
      email,
      firstName,
      lastName,
      passwordHash: await hashPassword(input.password),
      provider: 'email',
      username,
    })

    users.push(user)
    saveUsers(users)
    return saveSession(user)
  },

  async login(input: LoginInput) {
    const login = input.login.trim().toLowerCase()
    const passwordHash = await hashPassword(input.password)
    const user = getUsers().find((item) => (
      item.provider === 'email'
      && (item.email === login || item.username === login)
    ))

    if (!user || user.passwordHash !== passwordHash) {
      throw new AuthError('Неверный email/username или пароль.')
    }

    return saveSession({ ...user, status: 'online', updatedAt: new Date().toISOString() })
  },

  logout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY)
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
  },

  async googleLogin() {
    const accessToken = await requestOAuthToken('google', {
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      extra: 'prompt=select_account',
      scope: 'openid email profile',
    })
    const user = await fetchJson<GoogleUserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const providerId = user.sub || user.id

    if (!providerId) {
      throw new AuthError('Google не вернул id пользователя.')
    }

    return upsertOAuthUser({
      avatar: user.picture,
      email: user.email,
      name: user.name,
      provider: 'google',
      providerId,
      username: user.email?.split('@')[0] || user.name,
    })
  },

  async vkLogin() {
    const authCode = await requestOAuthCode('vk', {
      authorizeUrl: 'https://id.vk.com/authorize',
      scope: 'email',
    })
    const tokenBody = new URLSearchParams({
      client_id: authCode.clientId,
      code: authCode.code,
      code_verifier: authCode.codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: authCode.redirectUri,
      state: authCode.state,
    })

    if (authCode.deviceId) {
      tokenBody.set('device_id', authCode.deviceId)
    }

    const token = await fetchJson<{ access_token?: string; error?: string; error_description?: string }>('https://id.vk.com/oauth2/auth', {
      body: tokenBody,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    })

    if (!token.access_token) {
      throw new AuthError(token.error_description || token.error || 'VK ID не вернул access_token.')
    }

    const profile = await fetchJson<{ user?: VkUserInfo; error?: string; error_description?: string }>('https://id.vk.com/oauth2/user_info', {
      body: new URLSearchParams({
        access_token: token.access_token,
        client_id: authCode.clientId,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST',
    })
    const user = profile.user

    if (!user) {
      throw new AuthError(profile.error_description || profile.error || 'VK ID не вернул профиль пользователя.')
    }

    return upsertOAuthUser({
      avatar: user.avatar,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      provider: 'vk',
      providerId: String(user.user_id),
      username: `vk-${user.user_id}`,
    })
  },

  async yandexLogin() {
    const accessToken = await requestOAuthToken('yandex', {
      authorizeUrl: 'https://oauth.yandex.ru/authorize',
      scope: 'login:email login:avatar login:info',
    })
    const user = await fetchJson<YandexUserInfo>('https://login.yandex.ru/info?format=json', {
      headers: { Authorization: `OAuth ${accessToken}` },
    })
    const avatar = user.default_avatar_id
      ? `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200`
      : undefined

    return upsertOAuthUser({
      avatar,
      email: user.default_email,
      firstName: user.first_name,
      lastName: user.last_name,
      name: user.real_name || user.display_name,
      provider: 'yandex',
      providerId: user.id,
      username: user.login,
    })
  },

  getCurrentUser() {
    return safeRead<NexusAuthSession | null>(SESSION_STORAGE_KEY, null)
  },

  updateProfile(profile: Partial<NexusUserProfile>) {
    const session = this.getCurrentUser()

    if (!session) {
      return null
    }

    const users = getUsers()
    const index = users.findIndex((user) => user.id === session.currentUser.id)

    if (index === -1) {
      return null
    }

    const updatedUser: StoredUser = {
      ...users[index],
      ...profile,
      updatedAt: new Date().toISOString(),
    }

    users[index] = updatedUser
    saveUsers(users)
    return saveSession(updatedUser)
  },
}
