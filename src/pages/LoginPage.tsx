import { Apple, GitBranch, Shield, Volume2, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function NexusOrb() {
  return (
    <div className="nexus-orb" aria-hidden="true">
      <div className="orb-cube">N</div>
      <div className="orb-base" />
    </div>
  )
}

export function LoginPage() {
  return (
    <section className="auth-stage">
      <motion.aside className="auth-showcase" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <Link className="auth-logo" to="/app"><span>N</span><strong>Nexus</strong></Link>
        <p>Ваше пространство<br />для общения и сообществ</p>
        <div className="auth-benefits">
          <span><Workflow size={18} />Создавайте серверы<br />и объединяйте людей</span>
          <span><Volume2 size={18} />Голосовые комнаты<br />высокого качества</span>
          <span><Shield size={18} />Безопасность<br />и приватность</span>
        </div>
        <NexusOrb />
      </motion.aside>

      <motion.section className="auth-card auth-panel" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-heading">
          <h1>Войти в Nexus</h1>
          <p>Выберите удобный способ входа</p>
        </div>
        <div className="oauth-stack">
          <button type="button"><span className="google-mark">G</span>Продолжить с Google</button>
          <button type="button"><Apple size={18} />Продолжить с Apple</button>
          <button type="button"><GitBranch size={18} />Продолжить с GitHub</button>
        </div>
        <div className="auth-divider"><span>или войдите с email</span></div>
        <form className="auth-form">
          <label>Email<input type="email" placeholder="email@example.com" /></label>
          <label>Пароль<input type="password" placeholder="••••••••••••" /></label>
          <div className="auth-row">
            <label><input defaultChecked type="checkbox" /> Запомнить меня</label>
            <a href="#forgot">Забыли пароль?</a>
          </div>
          <button type="button">Войти</button>
        </form>
        <p className="auth-switch">Нет аккаунта? <Link to="/register">Создать аккаунт</Link></p>
      </motion.section>
    </section>
  )
}
