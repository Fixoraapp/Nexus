import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="auth-shell nexus-auth-shell">
      <Outlet />
    </main>
  )
}
