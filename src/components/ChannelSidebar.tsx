import { ChevronDown, Hash, Home, Lock, Plus, Volume2 } from 'lucide-react'
import type { ChannelCategory, ChannelType } from '../types'
import type { NexusStore } from '../store/nexusStore'
import { UserProfileBar } from './UserProfileBar'

type Props = Pick<
  NexusStore,
  | 'activeChannelId'
  | 'activeServer'
  | 'currentUser'
  | 'deafened'
  | 'muted'
  | 'selectChannel'
  | 'serverUsers'
  | 'setActiveModal'
  | 'setDeafened'
  | 'setMuted'
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

export function ChannelSidebar(props: Props) {
  const { activeChannelId, activeServer, selectChannel, setActiveModal, voiceParticipants } = props
  const voiceUsers = props.serverUsers.filter((user) => voiceParticipants.some((participant) => participant.userId === user.id))

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
          <button type="button" onClick={() => setActiveModal('createServer')}>Создать сервер</button>
        </div>
        <UserProfileBar {...props} />
      </aside>
    )
  }

  return (
    <aside className="channel-sidebar">
      <header className="server-header">
        <button type="button" onClick={() => selectChannel(activeServer.channels[0]?.id ?? 'home')}>
          <span>{activeServer.name}</span>
          <ChevronDown size={16} />
        </button>
      </header>

      <button className={`browse-channels ${activeChannelId === 'home' ? 'is-active' : ''}`} type="button" onClick={() => selectChannel('home')}>
        <Home size={18} />
        Главная
      </button>

      <nav className="channel-groups" aria-label="Каналы">
        {categoryOrder.map((category) => {
          const groupedChannels = activeServer.channels.filter((channel) => channel.category === category)
          if (!groupedChannels.length) {
            return null
          }

          return (
            <section className="channel-group" key={category}>
              <div className="channel-group-title">
                <span>{categoryLabels[category]}</span>
                <button type="button" onClick={() => setActiveModal('createChannel')} title="Создать канал">
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
                  {channel.type === 'voice' && voiceUsers.length ? (
                    <div className="voice-mini-list">
                      {voiceUsers.map((user) => (
                        <span key={user.id}><i className={`avatar avatar-${user.status}`}>{user.avatar}</i>{user.displayName}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
          )
        })}
        {!activeServer.channels.length ? (
          <div className="channel-empty">
            <strong>Нет каналов</strong>
            <small>Создайте первый канал для этого сервера.</small>
            <button type="button" onClick={() => setActiveModal('createChannel')}>Создать канал</button>
          </div>
        ) : null}
      </nav>

      <UserProfileBar {...props} />
    </aside>
  )
}
