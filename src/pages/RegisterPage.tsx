import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

type Provider = 'google' | 'vk' | 'yandex'

function GoogleLogo() {
  return <span className="oauth-mark google-logo" aria-hidden="true">G</span>
}

function VkLogo() {
  return <span className="oauth-mark vk-logo" aria-hidden="true">VK</span>
}

function YandexLogo() {
  return <span className="oauth-mark yandex-logo" aria-hidden="true">Я</span>
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loadingProvider, setLoadingProvider] = useState<Provider | 'email' | null>(null)

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoadingProvider('email')

    try {
      const formData = new FormData(event.currentTarget)
      await authService.register({
        confirmPassword: String(formData.get('confirmPassword') || ''),
        email: String(formData.get('email') || ''),
        firstName: String(formData.get('firstName') || ''),
        lastName: String(formData.get('lastName') || ''),
        password: String(formData.get('password') || ''),
        username: String(formData.get('username') || ''),
      })
      navigate('/app', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не удалось создать аккаунт.')
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

      navigate('/app', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'OAuth вход не выполнен.')
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <section className="register-stage">
      <motion.section className="auth-card auth-panel register-panel" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
        <div className="auth-heading">
          <h1>Создать аккаунт<br />Nexus</h1>
          <p>Начните строить свое сообщество</p>
        </div>
        <form className="auth-form" onSubmit={register}>
          <div className="auth-name-grid">
            <label>Имя<input name="firstName" type="text" autoComplete="given-name" placeholder="Иван" required /></label>
            <label>Фамилия<input name="lastName" type="text" autoComplete="family-name" placeholder="Петров" required /></label>
          </div>
          <label>Username<input name="username" type="text" autoComplete="username" placeholder="username" required /></label>
          <label>Email<input name="email" type="email" autoComplete="email" placeholder="email@example.com" required /></label>
          <label>Пароль<input name="password" type="password" autoComplete="new-password" placeholder="Минимум 8 символов, буква и цифра" required /></label>
          <label>Подтверждение пароля<input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Повторите пароль" required /></label>
          <div className="password-strength"><span /></div>
          <label className="terms-row"><input defaultChecked required type="checkbox" /> Я принимаю условия использования и политику конфиденциальности</label>
          {error ? <p className="auth-error" role="alert">{error}</p> : null}
          <button type="submit" disabled={loadingProvider !== null}>{loadingProvider === 'email' ? 'Создаем...' : 'Создать аккаунт'}</button>
        </form>
        <div className="auth-divider"><span>или продолжите с</span></div>
        <div className="oauth-row">
          <button className="oauth-button is-google" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('google')}><GoogleLogo />Google</button>
          <button className="oauth-button is-vk" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('vk')}><VkLogo />VK</button>
          <button className="oauth-button is-yandex" type="button" disabled={loadingProvider !== null} onClick={() => socialLogin('yandex')}><YandexLogo />Яндекс</button>
        </div>
        <p className="auth-switch">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </motion.section>

      <motion.aside className="register-visual" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <div className="nexus-orb is-large" aria-hidden="true">
          <div className="orb-cube">N</div>
          <div className="orb-base" />
        </div>
      </motion.aside>
    </section>
  )
}
