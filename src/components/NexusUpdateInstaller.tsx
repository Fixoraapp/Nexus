import { Check, Minus, PackageCheck, Square, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  version: string
  onInstall: () => void
}

const steps = [
  'Подготовка обновления Nexus...',
  'Проверка загруженных файлов...',
  'Подготовка перезапуска...',
  'Финализация...',
  'Обновление готово!',
]

export function NexusUpdateInstaller({ version, onInstall }: Props) {
  const [progress, setProgress] = useState(0)
  const [isRestarting, setIsRestarting] = useState(false)

  useEffect(() => {
    const startedAt = Date.now()
    const duration = 1800

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const ratio = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - ratio, 3)
      setProgress(Math.round(eased * 100))

      if (ratio >= 1) {
        window.clearInterval(timer)
      }
    }, 80)

    return () => window.clearInterval(timer)
  }, [])

  const activeStep = useMemo(() => {
    if (progress >= 100) {
      return steps[4]
    }

    const index = Math.min(Math.floor((progress / 100) * (steps.length - 1)), steps.length - 2)
    return steps[index]
  }, [progress])

  const install = () => {
    setIsRestarting(true)
    window.setTimeout(onInstall, 550)
  }

  return (
    <motion.aside
      className="nexus-update-installer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nexus-update-title"
    >
      <motion.section
        className="installer-card"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
      >
        <header className="installer-titlebar">
          <div className="installer-title">
            <span className="installer-logo"><PackageCheck size={18} /></span>
            <strong>Обновление Nexus</strong>
          </div>
          <div className="installer-window-dots" aria-hidden="true">
            <span><Minus size={14} /></span>
            <span><Square size={12} /></span>
            <span><X size={14} /></span>
          </div>
        </header>

        <div className="installer-body">
          <div className="installer-product-row">
            <h2 id="nexus-update-title">NEXUS CORE</h2>
            <span className="installer-version">v{version} stable</span>
          </div>

          <div className="installer-status-box">
            <span className="installer-pulse"></span>
            <strong>{isRestarting ? 'Перезапуск Nexus...' : activeStep}</strong>
            {progress >= 100 && !isRestarting ? (
              <span className="installer-ready"><Check size={17} /> Готово</span>
            ) : null}
          </div>

          <div className="installer-progress-head">
            <span>ПРОГРЕСС УСТАНОВКИ</span>
            <strong>{progress}%</strong>
          </div>
          <div className="installer-progress">
            <span style={{ width: `${progress}%` }}></span>
          </div>

          <dl className="installer-details">
            <div>
              <dt>Режим:</dt>
              <dd>Установка скачанного обновления</dd>
            </div>
            <div>
              <dt>Компоненты:</dt>
              <dd>Core, UI, Electron Runtime, Auto Update Bridge</dd>
            </div>
            <div>
              <dt>Действие:</dt>
              <dd>Nexus закроется и сразу откроется уже обновленным</dd>
            </div>
            <div>
              <dt>Источник:</dt>
              <dd>GitHub Releases</dd>
            </div>
          </dl>
        </div>

        <footer className="installer-footer">
          <button type="button" disabled={progress < 100 || isRestarting} onClick={install}>
            {isRestarting ? 'Перезапуск Nexus...' : 'Установить и перезапустить'}
          </button>
        </footer>
      </motion.section>
    </motion.aside>
  )
}
