import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Download, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { NexusUpdateInstaller } from './NexusUpdateInstaller'

type UpdateStatus = {
  status: string
  message: string
}

const appVersion = '1.0.4'

export function UpdateToast() {
  const [status, setStatus] = useState<UpdateStatus | null>(null)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [showInstaller, setShowInstaller] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!window.nexusUpdater) {
      return
    }

    const removeStatusListener = window.nexusUpdater.on('update-status', (payload) => {
      setStatus(payload)

      if (payload.status === 'update-available') {
        setProgress(0)
        setIsReady(false)
        setShowInstaller(false)
        setDismissed(false)
      }
    })

    const removeProgressListener = window.nexusUpdater.on('update-progress', (percent) => {
      setProgress(Math.max(0, Math.min(100, Math.round(percent))))
    })

    const removeReadyListener = window.nexusUpdater.on('update-ready', () => {
      setProgress(100)
      setIsReady(true)
      setDismissed(false)
      setStatus({
        status: 'update-downloaded',
        message: 'Обновление Nexus готово к установке.',
      })
    })

    return () => {
      removeStatusListener()
      removeProgressListener()
      removeReadyListener()
    }
  }, [])

  const shouldShowToast = useMemo(() => {
    return Boolean(status && status.status !== 'update-not-available' && !dismissed && !showInstaller)
  }, [dismissed, showInstaller, status])

  const title = useMemo(() => {
    if (status?.status === 'error') {
      return 'Не удалось обновить Nexus'
    }

    if (isReady) {
      return 'Обновление Nexus готово'
    }

    if (status?.status === 'download-progress' || status?.status === 'update-available') {
      return 'Nexus загружает обновление'
    }

    return 'Проверка обновления'
  }, [isReady, status])

  const installDownloadedUpdate = () => {
    window.nexusUpdater?.installDownloadedUpdate()
  }

  return (
    <>
      <AnimatePresence>
        {shouldShowToast ? (
          <motion.aside
            className="update-toast nexus-update-toast"
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            role="status"
            aria-live="polite"
          >
            <div className="update-toast-mark">N</div>
            <div className="update-toast-content">
              <div className="update-toast-heading">
                <span>{title}</span>
                <strong>{progress}%</strong>
              </div>
              <p>{status?.message}</p>
              <div className="update-progress" aria-label={`Update progress ${progress}%`}>
                <span style={{ width: `${progress}%` }}></span>
              </div>
              <div className="update-toast-actions">
                {isReady ? (
                  <button type="button" onClick={() => setShowInstaller(true)}>
                    <Download size={15} />
                    Установить
                  </button>
                ) : null}
                <button type="button" onClick={() => setDismissed(true)}>
                  {isReady ? <Clock size={15} /> : <X size={15} />}
                  {isReady ? 'Позже' : 'Скрыть'}
                </button>
              </div>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {showInstaller ? (
          <NexusUpdateInstaller version={appVersion} onInstall={installDownloadedUpdate} />
        ) : null}
      </AnimatePresence>
    </>
  )
}
