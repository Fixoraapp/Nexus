import { motion } from 'framer-motion'

const rooms = [
  ['Launch Room', '12 online', 'Planning the next release'],
  ['Design Review', '5 online', 'Homepage polish and motion'],
  ['Voice Lounge', '18 online', 'Open community channel'],
]

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <span className="eyebrow">Home</span>
          <h1>Your Nexus is live.</h1>
          <p>Jump into active rooms, manage communities, and keep every conversation moving.</p>
        </div>
        <button type="button">Create room</button>
      </section>

      <section className="dashboard-grid">
        {rooms.map(([title, meta, description], index) => (
          <motion.article
            className="dashboard-card"
            key={title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <span className="card-dot"></span>
            <h2>{title}</h2>
            <small>{meta}</small>
            <p>{description}</p>
          </motion.article>
        ))}
      </section>
    </main>
  )
}
