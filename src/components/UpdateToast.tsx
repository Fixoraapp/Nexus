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

  useEffect(() => {
    if (!window.nexusUpdater) {
      return
    }

    const removeStatusListener = window.nexusUpdater.on('update-status', (payload) => {
      setStatus(payload)

      if (payload.status === 'update-available') {
        setProgress(0)
        setIsReady(false)
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

  return (
    <AnimatePresence>
      {shouldShow ? (
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
              <span>Nexus обновляется...</span>
              <strong>{progress}%</strong>
            </div>
            <p>{status?.message}</p>
            <div className="update-progress" aria-label={`Update progress ${progress}%`}>
              <span style={{ width: `${progress}%` }}></span>
            </div>
            {isReady ? (
              <button type="button" onClick={() => window.nexusUpdater?.installNow()}>
                Установить сейчас
              </button>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}
