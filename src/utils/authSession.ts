import { authService } from '../services/authService'

export type NexusSession = {
  currentUser: NonNullable<ReturnType<typeof authService.getCurrentUser>>['currentUser']
  displayName: string
  homePath: string
  settings: NonNullable<ReturnType<typeof authService.getCurrentUser>>['settings']
  token: string
  username: string
}

export function getSession(): NexusSession | null {
  const session = authService.getCurrentUser()

  if (!session) {
    return null
  }

  return {
    ...session,
    displayName: session.currentUser.displayName,
    homePath: '/app',
    username: session.currentUser.username,
  }
}

export function getHomePath() {
  return '/app'
}

export function createSession(username: string, displayName = username) {
  const session = authService.updateProfile({
    displayName: displayName.trim() || username,
    username: username.trim().toLowerCase(),
  })

  return session ? getSession() : null
}

export function clearSession() {
  authService.logout()
}
