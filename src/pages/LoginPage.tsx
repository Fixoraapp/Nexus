import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <motion.section className="auth-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Link className="brand auth-brand" to="/app">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nexus</strong>
          <small>Добро пожаловать</small>
        </span>
      </Link>
      <div className="auth-heading">
        <h1>Вход</h1>
        <p>Откройте свои сообщества, голосовые комнаты и рабочие пространства Nexus.</p>
      </div>
      <form className="auth-form">
        <label>
          Email
          <input type="email" placeholder="you@nexus.app" />
        </label>
        <label>
          Пароль
          <input type="password" placeholder="Введите пароль" />
        </label>
        <div className="auth-row">
          <label><input type="checkbox" /> Запомнить меня</label>
          <a href="#forgot">Забыли пароль?</a>
        </div>
        <button type="button">Войти</button>
      </form>
      <p className="auth-switch">
        Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
      </p>
    </motion.section>
  )
}
