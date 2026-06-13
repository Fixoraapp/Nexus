import { Camera, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSession, getSession } from '../utils/authSession'

const statuses = ['Онлайн', 'Не беспокоить', 'Отошёл', 'Невидимый']

export function NexusSetupWizard() {
  const navigate = useNavigate()
  const [status, setStatus] = useState(statuses[0])
  const session = getSession()

  const finishSetup = (formData: FormData) => {
    const displayName = String(formData.get('displayName') || session?.displayName || 'Итан Браун')
    const nextSession = createSession(session?.username ?? displayName, displayName)
    navigate(nextSession.homePath, { replace: true })
  }

  return (
    <main className="profile-setup-page">
      <motion.section className="profile-setup-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="setup-copy">
          <h1>Почти готово!</h1>
          <p>Создайте свой профиль</p>
        </div>

        <div className="profile-avatar-picker">
          <span className="profile-avatar-image" />
          <button type="button" title="Загрузить аватар"><Camera size={20} /></button>
        </div>

        <form className="profile-setup-form" action={finishSetup}>
          <label>Имя пользователя<input name="displayName" defaultValue={session?.displayName ?? 'Итан Браун'} /></label>
          <label>О себе (необязательно)<input name="bio" defaultValue="Люблю технологии и общение 🚀" /></label>
          <fieldset>
            <legend>Выберите статус</legend>
            {statuses.map((item) => (
              <button className={status === item ? 'is-selected' : ''} key={item} type="button" onClick={() => setStatus(item)}>
                <span />
                {status === item ? <CheckCircle2 size={16} /> : null}
                {item}
              </button>
            ))}
          </fieldset>
          <button className="modal-primary" type="submit">Продолжить</button>
        </form>
      </motion.section>
    </main>
  )
}
