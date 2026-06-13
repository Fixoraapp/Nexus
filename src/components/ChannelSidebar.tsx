import { ChevronDown, Hash, Home, Lock, Plus, Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { ChannelCategory, ChannelType } from '../types'
import type { NexusStore } from '../store/nexusStore'
import { ServerMenuDropdown } from './ServerMenuDropdown'
import { UserProfileBar } from './UserProfileBar'

type Props = Pick<
  NexusStore,
  | 'activeChannel'
  | 'activeChannelId'
  | 'activeModal'
  | 'activeServer'
  | 'clearActivity'
  | 'closeUserProfilePopout'
  | 'copyServerId'
  | 'copyUserId'
  | 'currentActivity'
  | 'currentUser'
  | 'deafened'
  | 'leaveVoiceChannel'
  | 'logout'
  | 'markServerAsRead'
  | 'muteServer'
  | 'muted'
  | 'openActivityModal'
  | 'openCreateCategory'
  | 'openCreateChannelModal'
  | 'openCreateEvent'
  | 'openInviteModal'
  | 'openIsolationModal'
  | 'openServerPrivacy'
  | 'openServerProfile'
  | 'openServerSettings'
  | 'openSettings'
  | 'openUserProfilePopout'
  | 'screenSharing'
  | 'selectChannel'
  | 'serverCategories'
  | 'serverUsers'
  | 'setActiveModal'
  | 'setDeafened'
  | 'setMuted'
  | 'settings'
  | 'showSoon'
  | 'toggleDeafen'
  | 'toggleHideMutedChannels'
  | 'toggleMute'
  | 'toggleShowAllChannels'
  | 'toggleStreaming'
  | 'updateServerNotificationPreference'
  | 'updateUserStatus'
  | 'users'
  | 'voiceParticipants'
>

const categoryLabels: Record<ChannelCategory, string> = {
  events: 'СОБЫТИЯ',
  information: 'ИНФОРМАЦИЯ',
  private: 'ПРИВАТНЫЕ',
  text: 'ТЕКСТОВЫЕ КАНАЛЫ',
  voice: 'ГОЛОСОВЫЕ КАНАЛЫ',
}

const categoryOrder: ChannelCategory[] = ['information', 'text', 'voice', 'events', 'private']

function ChannelIcon({ isPrivate, type }: { isPrivate: boolean; type: ChannelType }) {
  if (isPrivate) return <Lock size={17} />
  if (type === 'voice') return <Volume2 size={17} />
  return <Hash size={17} />
}

function defaultTypeForCategory(category: ChannelCategory): ChannelType {
  return category === 'voice' ? 'voice' : 'text'
}

function canCreateChannel(currentUser: Props['currentUser'], activeServer: Props['activeServer'], serverUsers: Props['serverUsers']) {
  if (!currentUser || !activeServer) return false
  if (activeServer.ownerId === currentUser.id) return true
  const member = serverUsers.find((user) => user.id === currentUser.id)
  return Boolean(member?.roleIds.some((role) => role === 'owner' || role === 'admin'))
}

export function ChannelSidebar(props: Props) {
  const { activeChannelId, activeServer, openCreateChannelModal, selectChannel, setActiveModal, voiceParticipants } = props
  const [serverMenuOpen, setServerMenuOpen] = useState(false)
  const voiceUsers = (channelId: string) => props.serverUsers.filter((user) => voiceParticipants.some((participant) => participant.userId === user.id && participant.channelId === channelId))
  const canCreate = canCreateChannel(props.currentUser, activeServer, props.serverUsers)

  if (!activeServer) {
    return (
      <aside className="channel-sidebar">
        <header className="server-header">
          <button type="button"><span>Nexus</span><ChevronDown size={16} /></button>
        </header>
        <button className="browse-channels is-active" type="button" onClick={() => selectChannel('home')}>
          <Home size={18} />
          Главная
        </button>
        <div className="channel-empty">
          <strong>Нет серверов</strong>
          <small>Создайте первое сообщество или присоединитесь по invite-коду.</small>
          <button type="button" onClick={() => setActiveModal('addServer')}>Создать сервер</button>
        </div>
        <UserProfileBar {...props} />
      </aside>
    )
  }

  return (
    <aside className="channel-sidebar">
      <header className="server-header">
        <button className={serverMenuOpen ? 'is-open' : ''} type="button" onClick={() => setServerMenuOpen((value) => !value)}>
          <span>{activeServer.name}</span>
          <ChevronDown size={16} />
        </button>
        {serverMenuOpen ? <ServerMenuDropdown {...props} onClose={() => setServerMenuOpen(false)} server={activeServer} /> : null}
      </header>

      <button className={`browse-channels ${activeChannelId === 'home' ? 'is-active' : ''}`} type="button" onClick={() => selectChannel('home')}>
        <Home size={18} />
        Главная
      </button>

      <nav className="channel-groups" aria-label="Каналы">
        {categoryOrder.map((category) => {
          const groupedChannels = activeServer.channels.filter((channel) => channel.category === category && !channel.categoryId)
          if (!groupedChannels.length && category === 'private') return null

          return (
            <section className="channel-group" key={category}>
              <div className="channel-group-title">
                <span>{categoryLabels[category]}</span>
                <button
                  disabled={!canCreate}
                  type="button"
                  onClick={() => openCreateChannelModal({ category, defaultType: defaultTypeForCategory(category) })}
                  title={canCreate ? 'Создать канал' : 'Недостаточно прав'}
                >
                  <Plus size={15} />
                </button>
              </div>
              {groupedChannels.map((channel) => (
                <div key={channel.id}>
                  <button
                    className={`channel-row ${channel.id === activeChannelId ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => selectChannel(channel.id)}
                  >
                    <ChannelIcon isPrivate={channel.isPrivate} type={channel.type} />
                    <span>{channel.name}</span>
                    {channel.unreadCount ? <strong>{channel.unreadCount}</strong> : null}
                  </button>
                  {channel.type === 'voice' && voiceUsers(channel.id).length ? (
                    <div className="voice-mini-list">
                      {voiceUsers(channel.id).map((user) => (
                        <span key={user.id}><i className={`avatar avatar-${user.status}`}>{user.avatar}</i>{user.displayName}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
          )
        })}

        {props.serverCategories.filter((category) => category.serverId === activeServer.id).map((category) => {
          const groupedChannels = activeServer.channels.filter((channel) => channel.categoryId === category.id)

          return (
            <section className="channel-group custom-channel-group" key={category.id}>
              <div className="channel-group-title">
                <span>{category.name.toUpperCase()}</span>
                <button
                  disabled={!canCreate}
                  type="button"
                  onClick={() => openCreateChannelModal({ category: 'text', categoryId: category.id, defaultType: 'text' })}
                  title={canCreate ? 'Создать канал' : 'Недостаточно прав'}
                >
                  <Plus size={15} />
                </button>
              </div>
              {groupedChannels.map((channel) => (
                <button
                  className={`channel-row ${channel.id === activeChannelId ? 'is-active' : ''}`}
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel.id)}
                >
                  <ChannelIcon isPrivate={channel.isPrivate} type={channel.type} />
                  <span>{channel.name}</span>
                </button>
              ))}
              {!groupedChannels.length ? <p>Каналов пока нет</p> : null}
            </section>
          )
        })}
      </nav>

      <UserProfileBar {...props} />
    </aside>
  )
}
