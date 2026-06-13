import { useEffect, useState } from 'react'
import { AppRoutes } from '../routes/AppRoutes'
import { AppTitleBar } from '../components/AppTitleBar'
import { UpdateToast } from '../components/UpdateToast'
import { authService } from '../services/authService'

export function App() {
  const [authChecked, setAuthChecked] = useState(() => !authService.getToken())

  useEffect(() => {
    const token = authService.getToken()

    if (!token) {
      return
    }

    authService.getMe()
      .catch(() => {
        authService.logout()
        window.location.hash = '#/login'
      })
      .finally(() => setAuthChecked(true))
  }, [])

  return (
    <>
      <AppTitleBar />
      <div className="app-content">
        {authChecked ? <AppRoutes /> : null}
      </div>
      <UpdateToast />
    </>
  )
}
