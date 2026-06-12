import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type UpdateStatus = {
  status: string
  message: string
}

export function UpdateToast() {
  const [status, setStatus] = useState<UpdateStatus | null>(null)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    if (!window.nexusUpdater) {
      return
    }

    const removeStatusListener = window.nexusUpdater.on('update-status', (payload) => {
      setStatus(payload)

      if (payload.status === 'update-available') {
        setProgress(0)
        setIsReady(false)
        setIsInstalling(false)
      }
    })

    const removeProgressListener = window.nexusUpdater.on('update-progress', (percent) => {
      setProgress(Math.max(0, Math.min(100, Math.round(percent))))
    })

    const removeReadyListener = window.nexusUpdater.on('update-ready', () => {
      setProgress(100)
      setIsReady(true)
      setStatus({
        status: 'update-downloaded',
        message: 'Обновление Nexus готово.',
      })
    })

    return () => {
      removeStatusListener()
      removeProgressListener()
      removeReadyListener()
    }
  }, [])

  const shouldShow = useMemo(() => {
    return Boolean(status && status.status !== 'update-not-available')
  }, [status])

  const shouldShowOverlay = useMemo(() => {
    return Boolean(
      isInstalling ||
        status?.status === 'update-available' ||
        status?.status === 'download-progress',
    )
  }, [isInstalling, status])

  const installUpdate = () => {
    setIsInstalling(true)
    setIsReady(false)
    setStatus({
      status: 'installing',
      message: 'Пожалуйста, не закрывайте приложение',
    })

    window.setTimeout(() => {
      window.nexusUpdater?.installNow()
    }, 700)
  }

  return (
    <>
      <AnimatePresence>
        {shouldShowOverlay ? (
          <motion.aside
            className="update-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            role="status"
            aria-live="polite"
          >
            <motion.div
              className="update-overlay-content"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
            >
              <motion.div
                className="update-overlay-mark"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                N
              </motion.div>
              <div className="update-overlay-copy">
                <h2>{isInstalling ? 'Устанавливаем обновление...' : 'Nexus обновляется...'}</h2>
                <p>Пожалуйста, не закрывайте приложение</p>
              </div>
              <div className="update-progress update-progress-large" aria-label={`Update progress ${progress}%`}>
                <span style={{ width: `${isInstalling ? 100 : progress}%` }}></span>
              </div>
            </motion.div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {shouldShow && isReady ? (
          <motion.aside
            className="update-ready-modal"
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-ready-title"
          >
            <div className="update-toast-mark">N</div>
            <div className="update-toast-content">
              <div className="update-toast-heading">
                <span id="update-ready-title">Обновление готово</span>
                <strong>{progress}%</strong>
              </div>
              <p>{status?.message}</p>
              <div className="update-progress" aria-label={`Update progress ${progress}%`}>
                <span style={{ width: `${progress}%` }}></span>
              </div>
              <button type="button" onClick={installUpdate}>
                Установить и перезапустить
              </button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {shouldShow && status?.status === 'error' ? (
          <motion.aside
            className="update-toast"
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
                <span>Не удалось обновить Nexus</span>
              </div>
              <p>{status?.message}</p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  )
}
