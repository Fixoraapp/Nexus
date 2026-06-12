import { AppRoutes } from '../routes/AppRoutes'
import { AppTitleBar } from '../components/AppTitleBar'
import { UpdateToast } from '../components/UpdateToast'

export function App() {
  return (
    <>
      <AppTitleBar />
      <div className="app-content">
        <AppRoutes />
      </div>
      <UpdateToast />
    </>
  )
}
