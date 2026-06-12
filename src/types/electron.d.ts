type NexusUpdateStatus = {
  status: string
  message: string
}

type NexusUpdaterApi = {
  on(channel: 'update-status', callback: (payload: NexusUpdateStatus) => void): () => void
  on(channel: 'update-progress', callback: (percent: number) => void): () => void
  on(channel: 'update-ready', callback: () => void): () => void
  installNow(): void
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
