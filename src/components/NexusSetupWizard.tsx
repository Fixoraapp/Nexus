import { ArrowLeft, CheckCircle2, ChevronRight, FolderOpen, Layers3, Minus, PackageCheck, Square, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const installSteps = [
  'Подготовка окружения Nexus...',
  'Распаковка основных модулей...',
  'Установка интерфейса...',
  'Настройка Electron Runtime...',
  'Настройка Auto Update Bridge...',
  'Создание ярлыков...',
  'Финализация...',
]

export function NexusSetupWizard() {
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [installPath, setInstallPath] = useState('C:\\Program Files\\Nexus\\')
  const [progress, setProgress] = useState(0)
  const [launchNow, setLaunchNow] = useState(true)

  useEffect(() => {
    if (page !== 2) {
      return
    }

    const startedAt = Date.now()
    const duration = 4200
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const ratio = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - ratio, 2.8)
      const nextProgress = Math.round(eased * 100)
      setProgress(nextProgress)

      if (ratio >= 1) {
        window.clearInterval(timer)
        window.setTimeout(() => setPage(3), 450)
      }
    }, 90)

    return () => window.clearInterval(timer)
  }, [page])

  const status = useMemo(() => {
    const index = Math.min(Math.floor((progress / 100) * installSteps.length), installSteps.length - 1)
    return installSteps[index]
  }, [progress])

  const startInstall = () => {
    setProgress(0)
    setPage(2)
  }

  const finish = () => {
    navigate(launchNow ? '/app' : '/landing')
  }

  return (
    <main className="setup-page">
      <section className="setup-container">
        <header className="setup-header">
          <div className="setup-title">
            <span className="nexus-icon"><Layers3 size={22} /></span>
            <strong>Установка Nexus</strong>
          </div>
          <div className="setup-window-buttons" aria-hidden="true">
            <span><Minus size={15} /></span>
            <span><Square size={13} /></span>
            <span><X size={15} /></span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {page === 0 ? (
            <motion.section
              className="setup-step"
              key="welcome"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.24 }}
            >
              <div className="setup-hero-icon"><PackageCheck size={48} /></div>
              <h1>Добро пожаловать в Nexus</h1>
              <p>Этот мастер установит Nexus Core на ваш компьютер.</p>
              <p>Платформа для сообществ, команд, голосовых комнат и защищённого общения.</p>

              <div className="license-box">
                <strong>📜 ЛИЦЕНЗИОННОЕ СОГЛАШЕНИЕ Nexus</strong>
                <p>
                  Нажимая «Принимаю», вы соглашаетесь с условиями использования Nexus Suite.
                  Вы получаете неисключительную лицензию на использование программного обеспечения.
                  Запрещено копирование, реверс-инжиниринг и распространение без разрешения.
                  Продукт предоставляется «как есть».
                </p>
              </div>

              <label className="setup-checkbox">
                <input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" />
                <span>Я принимаю условия лицензионного соглашения</span>
              </label>

              <div className="nav-buttons">
                <button className="btn-next" disabled={!accepted} type="button" onClick={() => setPage(1)}>
                  Далее <ChevronRight size={18} />
                </button>
              </div>
            </motion.section>
          ) : null}

          {page === 1 ? (
            <motion.section
              className="setup-step"
              key="location"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.24 }}
            >
              <div className="setup-hero-icon"><FolderOpen size={46} /></div>
              <h1>Выбор папки установки</h1>
              <p>Выберите папку, в которую будет установлен Nexus Core.</p>

              <div className="folder-selector">
                <label>
                  Путь установки
                  <input value={installPath} onChange={(event) => setInstallPath(event.target.value)} />
                </label>
                <button type="button" onClick={() => setInstallPath('C:\\Program Files\\Nexus\\')}>Обзор</button>
              </div>

              <dl className="setup-summary">
                <div><dt>Компоненты:</dt><dd>Core, UI, Electron Runtime, Auto Update Bridge</dd></div>
                <div><dt>Размер:</dt><dd>примерно 420 МБ</dd></div>
                <div><dt>Ярлыки:</dt><dd>Рабочий стол и меню Пуск</dd></div>
              </dl>

              <div className="nav-buttons">
                <button className="btn-back" type="button" onClick={() => setPage(0)}>
                  <ArrowLeft size={18} /> Назад
                </button>
                <button className="btn-next" type="button" onClick={startInstall}>
                  Установить <ChevronRight size={18} />
                </button>
              </div>
            </motion.section>
          ) : null}

          {page === 2 ? (
            <motion.section
              className="setup-step setup-installing"
              key="installing"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.24 }}
            >
              <div className="setup-hero-icon"><Layers3 size={46} /></div>
              <h1>Установка Nexus</h1>
              <div className="setup-status">
                <span className="installer-pulse"></span>
                <strong>{status}</strong>
              </div>

              <div className="setup-progress-head">
                <span>ПРОГРЕСС УСТАНОВКИ</span>
                <strong>{progress}%</strong>
              </div>
              <div className="progress-fill">
                <span style={{ width: `${progress}%` }}></span>
              </div>

              <dl className="install-details">
                <div><dt>Путь:</dt><dd>{installPath}</dd></div>
                <div><dt>Компоненты:</dt><dd>Core, UI, Electron Runtime, Auto Update Bridge</dd></div>
                <div><dt>Распаковка:</dt><dd>nexus_bundle.pkg</dd></div>
                <div><dt>Подпись:</dt><dd>Nexus Technologies Inc. SHA-256</dd></div>
              </dl>
            </motion.section>
          ) : null}

          {page === 3 ? (
            <motion.section
              className="setup-step setup-complete"
              key="complete"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.24 }}
            >
              <div className="setup-success"><CheckCircle2 size={58} /></div>
              <h1>Установка завершена</h1>
              <p>Nexus успешно установлен и готов к работе.</p>
              <label className="setup-checkbox">
                <input checked={launchNow} onChange={(event) => setLaunchNow(event.target.checked)} type="checkbox" />
                <span>Запустить Nexus сейчас</span>
              </label>
              <div className="nav-buttons">
                <button className="btn-next" type="button" onClick={finish}>Готово</button>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </section>
    </main>
  )
}
