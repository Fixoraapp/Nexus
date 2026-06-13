type NexusUpdateStatus = {
  status: string
  message: string
}

type NexusUpdateState = NexusUpdateStatus & {
  progress: number
  ready: boolean
  version: string
}

type NexusUpdaterApi = {
  on(channel: 'update-status', callback: (payload: NexusUpdateStatus) => void): () => void
  on(channel: 'update-progress', callback: (percent: number) => void): () => void
  on(channel: 'update-ready', callback: () => void): () => void
  on(channel: 'update-state', callback: (payload: NexusUpdateState) => void): () => void
  checkNow(): Promise<void>
  getState(): Promise<NexusUpdateState>
  installNow(): void
  installDownloadedUpdate(): Promise<void>
}

type NexusWindowControlsApi = {
  minimize(): void
  maximize(): void
  close(): void
}

interface Window {
  nexusUpdater?: NexusUpdaterApi
  windowControls?: NexusWindowControlsApi
}
