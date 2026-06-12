const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('node:path')

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL)

let mainWindow
let splashWindow

function sendUpdateStatus(status, message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-status', { status, message })
  }
}

function sendUpdateProgress(percent) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-progress', percent)
  }
}

function sendUpdateReady() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update-ready')
  }
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus('checking-for-update', 'Проверяем обновления Nexus...')
  })

  autoUpdater.on('update-available', () => {
    sendUpdateStatus('update-available', 'Доступно новое обновление Nexus. Скачиваем...')
  })

  autoUpdater.on('update-not-available', () => {
    sendUpdateStatus('update-not-available', 'У вас установлена последняя версия Nexus.')
  })

  autoUpdater.on('download-progress', (progress) => {
    const percent = Math.round(progress.percent || 0)
    sendUpdateStatus('download-progress', 'Nexus обновляется...')
    sendUpdateProgress(percent)
  })

  autoUpdater.on('update-downloaded', () => {
    sendUpdateStatus('update-downloaded', 'Обновление Nexus готово.')
    sendUpdateProgress(100)
    sendUpdateReady()
  })

  autoUpdater.on('error', (error) => {
    sendUpdateStatus('error', error.message || 'Не удалось проверить обновления Nexus.')
  })

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })
}

function setupWindowControls() {
  ipcMain.on('window:minimize', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('window:maximize', () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      return
    }

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.close()
    }
  })
}

const splashMarkup = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 20% 20%, rgba(79, 124, 255, 0.32), transparent 32%),
          radial-gradient(circle at 78% 28%, rgba(123, 97, 255, 0.36), transparent 34%),
          linear-gradient(145deg, #0B1020 0%, #121A2D 54%, #1A2540 100%);
        color: #eef3ff;
        font-family: Inter, Segoe UI, system-ui, sans-serif;
      }
      .shell {
        width: 340px;
        min-height: 280px;
        display: grid;
        place-items: center;
        gap: 22px;
        padding: 40px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 28px;
        background: rgba(18, 26, 45, 0.72);
        box-shadow: 0 28px 90px rgba(0, 0, 0, 0.38);
        backdrop-filter: blur(20px);
      }
      .mark {
        width: 86px;
        height: 86px;
        display: grid;
        place-items: center;
        border-radius: 26px;
        background: linear-gradient(135deg, #4F7CFF, #7B61FF);
        box-shadow: 0 18px 48px rgba(79, 124, 255, 0.36);
        font-size: 42px;
        font-weight: 800;
      }
      h1 {
        margin: 0;
        font-size: 34px;
        letter-spacing: 0;
      }
      p {
        margin: 0;
        color: #aab6d3;
        font-size: 14px;
      }
      .bar {
        width: 180px;
        height: 5px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
      }
      .bar::before {
        content: "";
        display: block;
        width: 46%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, #4F7CFF, #7B61FF);
        animation: load 1.25s ease-in-out infinite;
      }
      @keyframes load {
        0% { transform: translateX(-90%); }
        100% { transform: translateX(230%); }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <div class="mark">N</div>
      <div>
        <h1>Nexus</h1>
        <p>Launching secure communities</p>
      </div>
      <div class="bar"></div>
    </main>
  </body>
</html>
`

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 460,
    height: 420,
    frame: false,
    transparent: true,
    resizable: false,
    show: true,
    alwaysOnTop: true,
    webPreferences: {
      sandbox: true,
    },
  })

  splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashMarkup)}`)
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,
    minWidth: 1200,
    minHeight: 750,
    backgroundColor: '#070A12',
    frame: false,
    show: false,
    title: 'Nexus',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
      sandbox: true,
    },
  })

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close()
      }
      mainWindow.show()

      if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify()
      }
    }, 700)
  })
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  setupAutoUpdater()
  setupWindowControls()
  createSplashWindow()
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSplashWindow()
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
