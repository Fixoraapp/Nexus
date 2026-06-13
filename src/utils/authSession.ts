const AUTH_STORAGE_KEY = 'nexus.auth.v1'

export type NexusSession = {
  displayName: string
  homePath: string
  username: string
}

const demoHomePaths: Record<string, string> = {
  alex: '/app',
  ava: '/app/dm',
  ethan: '/app',
  itan: '/app',
  maya: '/app/settings',
  noah: '/app/server/nexus/channel/nexus-gaming',
  olivia: '/app/friends',
}

export function getSession() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as NexusSession) : null
  } catch {
    return null
  }
}

export function getHomePath(username: string) {
  const normalized = username.trim().toLowerCase().split('@')[0]
  return demoHomePaths[normalized] ?? '/app'
}

export function createSession(username: string, displayName = username) {
  const normalized = username.trim().toLowerCase().split('@')[0] || 'ethan'
  const session: NexusSession = {
    displayName: displayName.trim() || normalized,
    homePath: getHomePath(normalized),
    username: normalized,
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}
