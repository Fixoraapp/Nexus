import { Shield, Volume2, Workflow } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

type Provider = 'google' | 'vk' | 'yandex'

function NexusOrb() {
  return (
    <div className="nexus-orb" aria-hidden="true">
      <div className="orb-cube">N</div>
      <div className="orb-base" />
    </div>
  )
}

function GoogleLogo() {
  return <span className="oauth-mark google-logo" aria-hidden="true">G</span>
}

function VkLogo() {
  return <span className="oauth-mark vk-logo" aria-hidden="true">VK</span>
}

function YandexLogo() {
  return <span className="oauth-mark yandex-logo" aria-hidden="true">Я</span>
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [loadingProvider, setLoadingProvider] = useState<Provider | 'email' | null>(null)
  const fromPath = typeof location.state === 'object' && location.state && 'from' in location.state
    ? String(location.state.from)
    : ''

  const finishLogin = () => {
    navigate(fromPath && fromPath !== '/login' ? fromPath : '/app', { replace: true })
  }

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoadingProvider('email')

    try {
      const formData = new FormData(event.currentTarget)
      await authService.login({
        login: String(formData.get('login') || ''),
        password: String(formData.get('password') || ''),
      })
      finishLogin()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось войти.')
    } finally {
      setLoadingProvider(null)
    }
  }

  const socialLogin = async (provider: Provider) => {
    setError('')
    setLoadingProvider(provider)

    try {
      if (provider === 'google') {
        await authService.googleLogin()
      } else if (provider === 'vk') {
        await authService.vkLogin()
      } else {
        await authService.yandexLogin()
      }

      finishLogin()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'OAuth вход не выполнен.')
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <section className="auth-stage">
      <motion.aside className="auth-showcase" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <Link className="auth-logo" to="/app"><span>N</span><strong>Nexus</strong></Link>
        <p>Ваше пространство<br />для общения и сообществ</p>
        <div className="auth-benefits">
          <span><Workflow size={18} />Создавайте серверы<br />и объединяйте людей</span>
          <span><Volume2 size={18} />Голосовые комнаты<br />высокого качества</span>
          <span><Shield size={18} />Безопасность<br />и приватность</span>
        </div>
        <NexusOrb />
      </motion.aside>

      <motion.section className="auth-card auth-panel" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-heading">
          <h1>Войти в Nexus</h1>
          <p>Выберите удобный способ входа</p>
        </div>
        <div className="oauth-stack">
          <button className="oauth-button is-google" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('google')}>
            <GoogleLogo />{loadingProvider === 'google' ? 'Открываем Google...' : 'Продолжить через Google'}
          </button>
          <button className="oauth-button is-vk" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('vk')}>
            <VkLogo />{loadingProvider === 'vk' ? 'Открываем VK...' : 'Продолжить через VK'}
          </button>
          <button className="oauth-button is-yandex" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('yandex')}>
            <YandexLogo />{loadingProvider === 'yandex' ? 'Открываем Яндекс...' : 'Продолжить через Яндекс'}
          </button>
        </div>
        <div className="auth-divider"><span>или войдите с email</span></div>
        <form className="auth-form" onSubmit={signIn}>
          <label>Email или username<input name="login" type="text" autoComplete="username" placeholder="name@example.com или username" required /></label>
          <label>Пароль<input name="password" type="password" autoComplete="current-password" placeholder="••••••••••••" required /></label>
          <div className="auth-row">
            <label><input defaultChecked type="checkbox" /> Запомнить меня</label>
            <a href="#forgot">Забыли пароль?</a>
          </div>
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          <button type="submit" disabled={loadingProvider !== null}>{loadingProvider === 'email' ? 'Входим...' : 'Войти'}</button>
        </form>
        <p className="auth-switch">Нет аккаунта? <Link to="/register">Создать аккаунт</Link></p>
      </motion.section>
    </section>
  )
}
