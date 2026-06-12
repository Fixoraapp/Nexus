import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  ['Серверы и каналы', 'Структурируйте команды, клубы и приватные группы в одном desktop-пространстве.'],
  ['Голосовые комнаты', 'Live-комнаты, участники, mute/deafen, экран и быстрые командные решения.'],
  ['Премиальный desktop', 'Темный интерфейс, быстрый Electron shell и аккуратные Windows-обновления.'],
]

export function LandingPage() {
  return (
    <main className="marketing-page">
      <section className="marketing-hero">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="brand-mark">N</span>
          <h1>Nexus</h1>
          <strong>Nexus Version 1.0.2</strong>
          <p>Премиальная коммуникационная платформа для Windows Desktop: сообщества, каналы, чат, voice rooms и управление участниками.</p>
          <div className="hero-actions">
            <Link className="primary-link" to="/register">Скачать для Windows</Link>
            <Link className="ghost-link" to="/app">Открыть приложение</Link>
          </div>
        </motion.div>
        <motion.div className="marketing-preview" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div className="preview-sidebar"></div>
          <div className="preview-chat">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-members"></div>
        </motion.div>
      </section>
      <section className="marketing-grid">
        {features.map(([title, description]) => (
          <article className="feature-card" key={title}>
            <span></span>
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
      <footer className="footer">
        <strong>Nexus</strong>
        <span>Premium desktop communities for Windows.</span>
      </footer>
    </main>
  )
}
