import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Features', to: '/#features' },
  { label: 'Communities', to: '/#communities' },
  { label: 'Voice', to: '/#voice' },
  { label: 'Security', to: '/#security' },
]

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-search">
        <span className="navbar-search-icon">/</span>
        <span>Search communities, rooms, and people</span>
      </div>
      <nav className="navbar-links" aria-label="Primary">
        {navItems.map((item) => (
          <a key={item.label} href={item.to}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="navbar-actions">
        <NavLink className="ghost-link" to="/login">
          Login
        </NavLink>
        <Link className="primary-link" to="/register">
          Get Nexus
        </Link>
      </div>
    </header>
  )
}
