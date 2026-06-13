import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MarketingLayout } from '../layouts/MarketingLayout'
import { NexusAppLayout } from '../layouts/NexusAppLayout'
import { NexusSetupWizard } from '../components/NexusSetupWizard'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { getSession } from '../utils/authSession'

function AuthRedirect() {
  const session = getSession()
  return <Navigate to={session?.homePath ?? '/login'} replace />
}

function ProtectedApp() {
  const location = useLocation()
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

function PublicOnly() {
  const session = getSession()
  return session ? <Navigate to={session.homePath} replace /> : <Outlet />
}

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<AuthRedirect />} />
          <Route path="/landing" element={<LandingPage />} />
        </Route>
        <Route element={<ProtectedApp />}>
          <Route path="/app" element={<NexusAppLayout />} />
          <Route path="/app/server/:serverId/channel/:channelId" element={<NexusAppLayout />} />
          <Route path="/app/dm" element={<NexusAppLayout />} />
          <Route path="/app/friends" element={<NexusAppLayout />} />
          <Route path="/app/settings" element={<NexusAppLayout />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/setup" element={<NexusSetupWizard />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route element={<PublicOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}
