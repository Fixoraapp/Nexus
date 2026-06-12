import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/SectionHeader'

const features = [
  ['Smart hubs', 'Organize teams, friends, and creators into dedicated spaces.'],
  ['Live presence', 'See who is active, speaking, streaming, or focused.'],
  ['Desktop first', 'A fast Electron shell with polished Windows workflows.'],
]

const communities = [
  'Design Ops',
  'Gaming Night',
  'Builders Lab',
  'Study Room',
  'Launch Crew',
  'Creator Hub',
]

export function LandingPage() {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">Premium desktop communities</span>
          <h1>Nexus</h1>
          <p>
            A dark, secure, voice-ready command center for communities that live
            across chat, events, rooms, and real-time collaboration.
          </p>
          <div className="hero-actions">
            <Link className="primary-link" to="/register">
              Download for Windows
            </Link>
            <Link className="ghost-link" to="/login">
              Sign in
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="room-card active">
            <span className="room-icon">V</span>
            <div>
              <strong>Strategy Voice</strong>
              <small>8 speakers live now</small>
            </div>
          </div>
          <div className="orbit-grid">
            {communities.slice(0, 4).map((community) => (
              <span key={community}>{community}</span>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="features" className="content-section">
        <SectionHeader
          eyebrow="Features"
          title="Everything a serious community needs"
          description="Nexus blends messaging, live rooms, moderation, and launch workflows in one focused desktop space."
        />
        <div className="feature-grid">
          {features.map(([title, description]) => (
            <motion.article
              className="feature-card"
              key={title}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <span></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="communities" className="content-section split-section">
        <SectionHeader
          eyebrow="Communities"
          title="Spaces that feel alive"
          description="Build focused hubs for projects, events, squads, and private groups."
        />
        <div className="community-cloud">
          {communities.map((community) => (
            <span key={community}>{community}</span>
          ))}
        </div>
      </section>

      <section id="voice" className="content-section voice-section">
        <SectionHeader
          eyebrow="Voice Chat"
          title="Crystal rooms for fast decisions"
          description="Persistent channels, stage modes, and clear presence make live collaboration feel immediate."
        />
        <div className="voice-board">
          {['Maya', 'Noah', 'Iris', 'Leo'].map((name, index) => (
            <div className="voice-user" key={name}>
              <span>{name.slice(0, 1)}</span>
              <div>
                <strong>{name}</strong>
                <small>{index === 0 ? 'Speaking' : 'Listening'}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="security" className="content-section security-section">
        <SectionHeader
          eyebrow="Security"
          title="Private by default"
          description="Granular roles, safe desktop isolation, and trusted moderation tools keep spaces under control."
        />
        <div className="security-list">
          <span>Role-based access</span>
          <span>Protected Electron runtime</span>
          <span>Encrypted session patterns</span>
        </div>
      </section>

      <section id="download" className="download-section">
        <div>
          <span className="eyebrow">Download</span>
          <h2>Ready for your Windows desktop.</h2>
          <p>Run Nexus locally with Electron during development, then ship an NSIS installer with electron-builder.</p>
        </div>
        <Link className="primary-link" to="/register">
          Start now
        </Link>
      </section>

      <footer className="footer">
        <strong>Nexus</strong>
        <span>Premium communities for Windows.</span>
      </footer>
    </main>
  )
}
