import { MessageSquarePlus, Monitor, ShieldCheck, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  { icon: MessageSquarePlus, title: 'Создавайте серверы', text: 'Объединяйте людей в своих сообществах' },
  { icon: Volume2, title: 'Голосовые комнаты', text: 'Качественная связь без ограничений' },
  { icon: ShieldCheck, title: 'Безопасность', text: 'Ваши данные под надёжной защитой' },
  { icon: Monitor, title: 'Кроссплатформенность', text: 'Работает на всех ваших устройствах' },
]

export function LandingPage() {
  return (
    <main className="welcome-page">
      <motion.section className="welcome-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="party-mark">🎉</div>
        <h1>Добро пожаловать в Nexus!</h1>
        <p>Ваше пространство для общения и сообществ</p>
        <div className="welcome-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span><Icon size={24} /></span>
              <div><strong>{title}</strong><small>{text}</small></div>
            </article>
          ))}
        </div>
        <Link className="primary-link" to="/app">Начать общение</Link>
      </motion.section>
    </main>
  )
}
