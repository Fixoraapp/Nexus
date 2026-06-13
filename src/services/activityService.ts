export type NexusActivity = {
  details?: string
  icon: string
  id: string
  name: string
  startedAt: string
  state?: string
  type: 'game' | 'app' | 'music' | 'custom'
  visible: boolean
}

const ACTIVITY_STORAGE_KEY = 'nexus.activity'
const listeners = new Set<(activity: NexusActivity | null) => void>()

function readActivity() {
  try {
    const stored = window.localStorage.getItem(ACTIVITY_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as NexusActivity) : null
  } catch {
    return null
  }
}

function emit(activity: NexusActivity | null) {
  listeners.forEach((listener) => listener(activity))
}

export const activityService = {
  getCurrentActivity() {
    return readActivity()
  },

  setManualActivity(activity: Omit<NexusActivity, 'id' | 'startedAt'> & { id?: string; startedAt?: string }) {
    const nextActivity: NexusActivity = {
      ...activity,
      id: activity.id || `activity-${Date.now()}`,
      startedAt: activity.startedAt || new Date().toISOString(),
    }

    window.localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(nextActivity))
    emit(nextActivity)
    return nextActivity
  },

  clearActivity() {
    window.localStorage.removeItem(ACTIVITY_STORAGE_KEY)
    emit(null)
  },

  subscribeActivityChanges(callback: (activity: NexusActivity | null) => void) {
    listeners.add(callback)

    return () => {
      listeners.delete(callback)
    }
  },
}
