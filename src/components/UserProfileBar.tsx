import { Headphones, Mic, MicOff, MonitorUp, Phone, Settings, Sparkles } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { ActivityCard } from './ActivityCard'
import { UserProfilePopout } from './UserProfilePopout'

type Props = Pick<
  NexusStore,
  | 'activeChannel'
  | 'activeModal'
  | 'activeServer'
  | 'clearActivity'
  | 'closeUserProfilePopout'
  | 'copyUserId'
  | 'currentActivity'
  | 'currentUser'
  | 'deafened'
  | 'leaveVoiceChannel'
  | 'logout'
  | 'muted'
  | 'openActivityModal'
  | 'openSettings'
  | 'openUserProfilePopout'
  | 'screenSharing'
  | 'showSoon'
  | 'toggleDeafen'
  | 'toggleMute'
  | 'toggleStreaming'
  | 'updateUserStatus'
  | 'voiceParticipants'
>

const statusLabels = {
  dnd: 'Не беспокоить',
  idle: 'Отошел',
  offline: 'Невидимый',
  online: 'В сети',
}

export function UserProfileBar(props: Props) {
  const {
    activeChannel,
    activeModal,
    activeServer,
    clearActivity,
    closeUserProfilePopout,
    copyUserId,
    currentActivity,
    currentUser,
    deafened,
    leaveVoiceChannel,
    logout,
    muted,
    openActivityModal,
    openSettings,
    openUserProfilePopout,
    screenSharing,
    showSoon,
    toggleDeafen,
    toggleMute,
    toggleStreaming,
    updateUserStatus,
    voiceParticipants,
  } = props
  const user = currentUser ?? {
    avatar: 'N',
    displayName: 'Nexus User',
    status: 'online' as const,
    username: 'user',
  }
  const voiceSession = currentUser ? voiceParticipants.find((participant) => participant.userId === currentUser.id) : null
  const voiceChannelName = activeChannel && voiceSession?.channelId === activeChannel.id ? activeChannel.name : activeServer?.channels.find((channel) => channel.id === voiceSession?.channelId)?.name

  return (
    <div className="user-control-panel">
      {activeModal === 'profile' ? (
        <UserProfilePopout
          copyUserId={copyUserId}
          currentActivity={currentActivity}
          currentUser={currentUser}
          logout={logout}
          onClose={closeUserProfilePopout}
          openActivityModal={openActivityModal}
          openSettings={openSettings}
          showSoon={showSoon}
          updateUserStatus={updateUserStatus}
        />
      ) : null}

      {voiceSession ? (
        <div className="voice-status-card">
          <span>
            <strong>Голосовая связь подключена</strong>
            <small>{voiceChannelName ? `${activeServer?.name ?? 'Nexus'} / ${voiceChannelName}` : activeServer?.name ?? 'Nexus'}</small>
          </span>
          <button type="button" onClick={leaveVoiceChannel} title="Отключиться">
            <Phone size={15} />
          </button>
        </div>
      ) : (
        <ActivityCard activity={currentActivity} clearActivity={clearActivity} openActivityModal={openActivityModal} />
      )}

      <div className="user-control-bar">
        <button className="user-identity" type="button" onClick={openUserProfilePopout}>
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
          <button type="button" onClick={openActivityModal} title="Активность">
            <Sparkles size={16} />
          </button>
          <button className="settings-control" type="button" onClick={openSettings} title="Настройки">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
