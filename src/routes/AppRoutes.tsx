import { HashRouter, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MarketingLayout } from '../layouts/MarketingLayout'
import { NexusAppLayout } from '../layouts/NexusAppLayout'
import { NexusSetupWizard } from '../components/NexusSetupWizard'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route index element={<NexusAppLayout />} />
          <Route path="/landing" element={<LandingPage />} />
        </Route>
        <Route path="/app" element={<NexusAppLayout />} />
        <Route path="/app/server/:serverId/channel/:channelId" element={<NexusAppLayout />} />
        <Route path="/app/dm" element={<NexusAppLayout />} />
        <Route path="/app/friends" element={<NexusAppLayout />} />
        <Route path="/app/settings" element={<NexusAppLayout />} />
        <Route path="/setup" element={<NexusSetupWizard />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
