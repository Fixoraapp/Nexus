import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function LoginPage() {
  return (
    <motion.section
      className="auth-card"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nexus</strong>
          <small>Welcome back</small>
        </span>
      </Link>
      <div className="auth-heading">
        <h1>Login</h1>
        <p>Access your communities, rooms, and secure Nexus workspace.</p>
      </div>
      <form className="auth-form">
        <label>
          Email
          <input type="email" placeholder="you@nexus.app" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Enter password" />
        </label>
        <button type="button">Sign in</button>
      </form>
      <p className="auth-switch">
        New to Nexus? <Link to="/register">Create account</Link>
      </p>
    </motion.section>
  )
}
