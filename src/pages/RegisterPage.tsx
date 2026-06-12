import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function RegisterPage() {
  return (
    <motion.section className="auth-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Link className="brand auth-brand" to="/app">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nexus</strong>
          <small>Создать пространство</small>
        </span>
      </Link>
      <div className="auth-heading">
        <h1>Регистрация</h1>
        <p>Запустите премиальное пространство для команды, игрового клуба или приватного сообщества.</p>
      </div>
      <form className="auth-form">
        <label>
          Имя пользователя
          <input type="text" placeholder="alex" />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@nexus.app" />
        </label>
        <label>
          Пароль
          <input type="password" placeholder="Создайте пароль" />
        </label>
        <button type="button">Создать аккаунт</button>
      </form>
      <p className="auth-switch">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </motion.section>
  )
}
