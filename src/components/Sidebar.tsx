import { NavLink } from 'react-router-dom'

const sidebarItems = [
  { label: 'Landing', to: '/', icon: 'N' },
  { label: 'Home', to: '/home', icon: 'H' },
  { label: 'Voice', to: '/#voice', icon: 'V' },
  { label: 'Shield', to: '/#security', icon: 'S' },
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/" aria-label="Nexus landing">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nexus</strong>
          <small>Desktop</small>
        </span>
      </NavLink>

      <nav className="sidebar-nav" aria-label="Sidebar">
        {sidebarItems.map((item) =>
          item.to.includes('#') ? (
            <a key={item.label} href={item.to} className="sidebar-link">
              <span>{item.icon}</span>
              {item.label}
            </a>
          ) : (
            <NavLink key={item.label} to={item.to} className="sidebar-link">
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="sidebar-status">
        <span className="pulse"></span>
        <div>
          <strong>Online</strong>
          <small>18 rooms active</small>
        </div>
      </div>
    </aside>
  )
}
