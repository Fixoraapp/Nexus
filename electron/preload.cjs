const { contextBridge, ipcRenderer } = require('electron')

const validUpdateChannels = new Set([
  'update-status',
  'update-progress',
  'update-ready',
])

contextBridge.exposeInMainWorld('nexusUpdater', {
  on(channel, callback) {
    if (!validUpdateChannels.has(channel)) {
      return () => undefined
    }

    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on(channel, listener)

    return () => {
      ipcRenderer.removeListener(channel, listener)
    }
  },
  installNow() {
    ipcRenderer.send('install-update')
  },
  installDownloadedUpdate() {
    return ipcRenderer.invoke('update:install-downloaded')
  },
})

contextBridge.exposeInMainWorld('windowControls', {
  minimize() {
    ipcRenderer.send('window:minimize')
  },
  maximize() {
    ipcRenderer.send('window:maximize')
  },
  close() {
    ipcRenderer.send('window:close')
  },
})
