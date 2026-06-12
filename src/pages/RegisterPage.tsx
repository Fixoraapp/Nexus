import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function RegisterPage() {
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
          <small>Create your hub</small>
        </span>
      </Link>
      <div className="auth-heading">
        <h1>Register</h1>
        <p>Start a premium workspace for your team, guild, or creator community.</p>
      </div>
      <form className="auth-form">
        <label>
          Name
          <input type="text" placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@nexus.app" />
        </label>
        <label>
          Password
          <input type="password" placeholder="Create password" />
        </label>
        <button type="button">Create account</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </motion.section>
  )
}
