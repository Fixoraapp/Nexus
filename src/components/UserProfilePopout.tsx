import { useEffect, useRef, useState } from 'react'
import { Copy, Edit3, Gamepad2, LogOut, MoreHorizontal, Moon, Sparkles, Users } from 'lucide-react'
import type { NexusActivity } from '../services/activityService'
import type { User, UserStatus } from '../types'
import { StatusMenu } from './StatusMenu'

type Props = {
  copyUserId: () => Promise<void> | void
  currentActivity: NexusActivity | null
  currentUser: User | null
  logout: () => void
  onClose: () => void
  openActivityModal: () => void
  openSettings: (section?: string) => void
  showSoon: (message?: string) => void
  updateUserStatus: (status: UserStatus) => void
}

const statusText: Record<UserStatus, string> = {
  dnd: 'Не беспокоить',
  idle: 'Отошел',
  offline: 'Невидимый',
  online: 'В сети',
}

function formatDuration(startedAt?: string) {
  if (!startedAt) return ''

  const started = new Date(startedAt).getTime()
  const diff = Math.max(0, Date.now() - started)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60

  if (hours > 0) return `${hours} ч ${restMinutes} мин`
  return `${Math.max(1, restMinutes)} мин`
}

export function UserProfilePopout({
  copyUserId,
  currentActivity,
  currentUser,
  logout,
  onClose,
  openActivityModal,
  openSettings,
  showSoon,
  updateUserStatus,
}: Props) {
  const popoutRef = useRef<HTMLElement | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [clock, setClock] = useState(0)
  const activityVisible = Boolean(currentActivity?.visible)
  const activityDuration = clock >= 0 ? formatDuration(currentActivity?.startedAt) : ''

  useEffect(() => {
    const interval = window.setInterval(() => setClock((value) => value + 1), 60000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (popoutRef.current && !popoutRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  if (!currentUser) return null

  const changeStatus = (status: UserStatus) => {
    updateUserStatus(status)
    setStatusOpen(false)
  }

  const editProfile = () => {
    openSettings('profile')
    onClose()
  }

  const openActivity = () => {
    openActivityModal()
    onClose()
  }

  const switchAccount = () => {
    showSoon('Переключение аккаунтов скоро будет доступно')
  }

  return (
    <section className="user-profile-popout" ref={popoutRef}>
      <div className="profile-popout-banner" />
      <div className="profile-popout-avatar-row">
        <span className={`profile-popout-avatar avatar-${currentUser.status}`}>{currentUser.avatar}</span>
        <i className={`profile-popout-status status-${currentUser.status}`} />
      </div>

      <div className="profile-popout-body">
        <header className="profile-popout-header">
          <div>
            <h3>{currentUser.displayName}</h3>
            <p>@{currentUser.username}</p>
          </div>
          <span className="profile-status-pill">{statusText[currentUser.status]}</span>
        </header>

        <div className="profile-badges" aria-label="Badges">
          <span><Sparkles size={13} /> Nexus</span>
          <span>ID</span>
        </div>

        <section className="profile-activity-block">
          <div className="profile-section-title">
            <span>{activityVisible ? 'Активность' : 'Коллекция игр'}</span>
            <button type="button" onClick={openActivity} title="Настроить активность">
              <MoreHorizontal size={16} />
            </button>
          </div>
          {activityVisible && currentActivity ? (
            <button className="profile-activity-row" type="button" onClick={openActivity}>
              <span className="profile-activity-icon">{currentActivity.icon}</span>
              <span>
                <small>Играет в</small>
                <strong>{currentActivity.name}</strong>
                <em>{currentActivity.details || currentActivity.state || `Запущено ${activityDuration}`}</em>
              </span>
            </button>
          ) : (
            <button className="profile-activity-row is-empty" type="button" onClick={openActivity}>
              <span className="profile-activity-icon"><Gamepad2 size={17} /></span>
              <span>
                <small>Активность</small>
                <strong>Нет активной активности</strong>
                <em>Можно выбрать вручную</em>
              </span>
            </button>
          )}
        </section>

        <div className="profile-action-list">
          <button type="button" onClick={editProfile}>
            <Edit3 size={16} />
            <span>Редактировать профиль</span>
          </button>
          <div className="profile-status-action">
            <button type="button" onClick={() => setStatusOpen((value) => !value)}>
              <Moon size={16} />
              <span>Сменить статус</span>
            </button>
            {statusOpen ? <StatusMenu currentStatus={currentUser.status} onChange={changeStatus} /> : null}
          </div>
          <button type="button" onClick={switchAccount}>
            <Users size={16} />
            <span>Переключение между учетными записями</span>
          </button>
          <button type="button" onClick={copyUserId}>
            <Copy size={16} />
            <span>Копировать ID пользователя</span>
          </button>
          <button className="is-danger" type="button" onClick={logout}>
            <LogOut size={16} />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </section>
  )
}
