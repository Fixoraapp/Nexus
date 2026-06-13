import { Apple, GitBranch } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { createSession } from '../utils/authSession'

export function RegisterPage() {
  const navigate = useNavigate()

  const register = (formData: FormData) => {
    const username = String(formData.get('username') || 'new-user')
    createSession(username, username)
    navigate('/setup', { replace: true })
  }

  return (
    <section className="register-stage">
      <motion.section className="auth-card auth-panel register-panel" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-heading">
          <h1>Создать аккаунт<br />Nexus</h1>
          <p>Начните строить своё сообщество</p>
        </div>
        <form className="auth-form" action={register}>
          <label>Имя пользователя<input name="username" type="text" placeholder="username" /></label>
          <label>Email<input name="email" type="email" placeholder="email@example.com" /></label>
          <label>Пароль<input name="password" type="password" placeholder="••••••••••••" /></label>
          <label>Подтвердите пароль<input name="confirmPassword" type="password" placeholder="••••••••••••" /></label>
          <div className="password-strength"><span /></div>
          <label className="terms-row"><input defaultChecked type="checkbox" /> Я принимаю условия использования и политику конфиденциальности</label>
          <button type="submit">Создать аккаунт</button>
        </form>
        <div className="auth-divider"><span>или продолжите с</span></div>
        <div className="oauth-row">
          <button type="button"><span className="google-mark">G</span>Google</button>
          <button type="button"><Apple size={16} />Apple</button>
          <button type="button"><GitBranch size={16} />GitHub</button>
        </div>
        <p className="auth-switch">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </motion.section>

      <motion.aside className="register-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <div className="nexus-orb is-large" aria-hidden="true">
          <div className="orb-cube">N</div>
          <div className="orb-base" />
        </div>
      </motion.aside>
    </section>
  )
}
