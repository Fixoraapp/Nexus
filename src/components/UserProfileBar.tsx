import { Headphones, Mic, MicOff, MonitorUp, Settings, Sparkles } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { ActivityCard } from './ActivityCard'

type Props = Pick<
  NexusStore,
  | 'clearActivity'
  | 'currentActivity'
  | 'currentUser'
  | 'deafened'
  | 'muted'
  | 'screenSharing'
  | 'setActiveModal'
  | 'toggleDeafen'
  | 'toggleMute'
  | 'toggleStreaming'
>

const statusLabels = {
  dnd: 'Не беспокоить',
  idle: 'Отошел',
  offline: 'Не в сети',
  online: 'В сети',
}

export function UserProfileBar(props: Props) {
  const {
    clearActivity,
    currentActivity,
    currentUser,
    deafened,
    muted,
    screenSharing,
    setActiveModal,
    toggleDeafen,
    toggleMute,
    toggleStreaming,
  } = props
  const user = currentUser ?? {
    avatar: 'N',
    displayName: 'Nexus User',
    status: 'online' as const,
    username: 'user',
  }

  return (
    <div className="user-control-panel">
      <ActivityCard activity={currentActivity} clearActivity={clearActivity} openActivityModal={() => setActiveModal('activity')} />

      <div className="user-control-bar">
        <button className="user-identity" type="button" onClick={() => setActiveModal('profile')}>
          <span className="user-avatar-wrap">
            <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
            <i className={`status-dot status-${user.status}`} />
          </span>
          <span className="user-copy">
            <strong>{user.displayName}</strong>
            <small>@{user.username} · {statusLabels[user.status]}</small>
          </span>
        </button>

        <div className="user-controls">
          <button className={muted ? 'is-muted' : ''} type="button" onClick={toggleMute} title={muted ? 'Включить микрофон' : 'Выключить микрофон'}>
            {muted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button className={deafened ? 'is-active' : ''} type="button" onClick={toggleDeafen} title="Заглушить звук">
            <Headphones size={16} />
          </button>
          <button className={screenSharing ? 'is-active' : ''} type="button" onClick={toggleStreaming} title="Стриминг">
            <MonitorUp size={16} />
          </button>
          <button type="button" onClick={() => setActiveModal('activity')} title="Активность">
            <Sparkles size={16} />
          </button>
          <button className="settings-control" type="button" onClick={() => setActiveModal('settings')} title="Настройки">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
