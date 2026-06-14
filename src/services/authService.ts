const TOKEN_STORAGE_KEY = 'nexus.token'
const CURRENT_USER_STORAGE_KEY = 'nexus.currentUser'
const SESSION_STORAGE_KEY = 'nexus.auth.session.v1'
const LEGACY_SESSION_STORAGE_KEY = 'nexus.auth.v1'
const SETTINGS_STORAGE_KEY = 'nexus.settings'
const ACTIVITY_STORAGE_KEY = 'nexus.activity'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://nexus-production-03a7.up.railway.app'

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

type ApiUser = {
  avatar?: string | null
  bio?: string | null
  createdAt: string
  email: string
  firstName: string
  id: string
  lastName: string
  status: string
  updatedAt: string
  username: string
}

type AuthResponse = {
  token: string
  user: ApiUser
}

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

function createDefaultSettings(): NexusSessionSettings {
  return {
    locale: 'ru-RU',
    notifications: true,
    theme: 'dark',
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

function toNexusUser(user: ApiUser): NexusUser {
  const displayName =
    `${user.firstName} ${user.lastName}`.trim() || user.username

  return {
    avatar: user.avatar || displayName.slice(0, 2).toUpperCase(),
    bio: user.bio || '',
    createdAt: user.createdAt,
    displayName,
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    status: user.status as NexusUser['status'],
    updatedAt: user.updatedAt,
    username: user.username,
  }
}

function saveSession(
  token: string,
  apiUser: ApiUser
): NexusAuthSession {
  const currentUser = toNexusUser(apiUser)

  const session: NexusAuthSession = {
    currentUser,
    settings: createDefaultSettings(),
    token,
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)

  window.localStorage.setItem(
    CURRENT_USER_STORAGE_KEY,
    JSON.stringify(currentUser)
  )

  window.localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify(session.settings)
  )

  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify(session)
  )

  window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY)

  return session
}

async function readApiError(response: Response) {
  try {
    const body = (await response.json()) as {
      message?: string
    }

    return (
      body.message ||
      `Request failed with status ${response.status}.`
    )
  } catch {
    return `Request failed with status ${response.status}.`
  }
}

async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new AuthError(await readApiError(response))
  }

  return response.json() as Promise<T>
}

export const authService = {
  async register(input: RegisterInput) {
    const result = await apiRequest<AuthResponse>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    return saveSession(result.token, result.user)
  },

  async login(input: LoginInput) {
    const result = await apiRequest<AuthResponse>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )

    return saveSession(result.token, result.user)
  },

  async getMe() {
    const token = this.getToken()

    if (!token) {
      return null
    }

    const result = await apiRequest<{ user: ApiUser }>(
      '/api/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return saveSession(token, result.user)
  },

  logout() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    window.localStorage.removeItem(LEGACY_SESSION_STORAGE_KEY)
    window.localStorage.removeItem(ACTIVITY_STORAGE_KEY)
  },

  saveToken(token: string) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
  },

  getToken() {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  },

  getCurrentUser() {
    const session = safeRead<NexusAuthSession | null>(
      SESSION_STORAGE_KEY,
      null
    )

    if (session) {
      return session
    }

    const token = this.getToken()

    const currentUser = safeRead<NexusUser | null>(
      CURRENT_USER_STORAGE_KEY,
      null
    )

    if (!token || !currentUser) {
      return null
    }

    return {
      currentUser,
      settings: createDefaultSettings(),
      token,
    }
  },

  async updateProfile(profile: Partial<NexusUserProfile>) {
    const token = this.getToken()

    if (!token) {
      return null
    }

    const result = await apiRequest<{ user: ApiUser }>(
      '/api/users/me',
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: profile.avatar,
          bio: profile.bio,
          firstName: profile.displayName?.split(' ')[0],
          lastName: profile.displayName
            ?.split(' ')
            .slice(1)
            .join(' '),
          status: profile.status,
          username: profile.username,
        }),
      }
    )

    return saveSession(token, result.user)
  },

  async googleLogin() {
    throw new AuthError(
      'Google OAuth будет подключен позже.'
    )
  },

  async vkLogin() {
    throw new AuthError(
      'VK OAuth будет подключен позже.'
    )
  },

  async yandexLogin() {
    throw new AuthError(
      'Yandex OAuth будет подключен позже.'
    )
  },
}