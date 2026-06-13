import { ArrowLeft, Link2, X } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

type Props = {
  joinServerByInvite: (code: string) => boolean
  onBack: () => void
  onClose: () => void
}

export function JoinServerModal({ joinServerByInvite, onBack, onClose }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isJoining, setJoining] = useState(false)

  const submit = () => {
    setError('')
    setJoining(true)
    window.setTimeout(() => {
      const joined = joinServerByInvite(code)
      setJoining(false)
      if (!joined) {
        setError('Приглашение не найдено или истекло')
      }
    }, 260)
  }

  return (
    <motion.section
      className="add-server-card"
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.22 }}
    >
      <button className="add-server-close" type="button" onClick={onClose}><X size={18} /></button>
      <header className="add-server-heading">
        <span className="add-server-mark"><Link2 size={24} /></span>
        <h2>Присоединиться к серверу</h2>
        <p>Введите invite-код или ссылку приглашения</p>
      </header>
      <label className="add-server-field">
        Invite-код
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="nexus.gg/abc123 или abc123" />
      </label>
      {error ? <p className="add-server-error">{error}</p> : null}
      <div className="add-server-actions">
        <button className="flow-secondary" type="button" onClick={onBack}><ArrowLeft size={16} />Назад</button>
        <button className="flow-primary" type="button" disabled={!code.trim() || isJoining} onClick={submit}>
          {isJoining ? 'Проверяем...' : 'Присоединиться'}
        </button>
      </div>
    </motion.section>
  )
}
