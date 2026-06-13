import { ChevronDown, Hash, Home, Lock, Plus, Volume2 } from 'lucide-react'
import type { ChannelCategory, ChannelType } from '../types'
import type { NexusStore } from '../store/nexusStore'
import { UserProfileBar } from './UserProfileBar'

type Props = Pick<
  NexusStore,
  | 'activeChannelId'
  | 'activeServer'
  | 'deafened'
  | 'muted'
  | 'selectChannel'
  | 'setActiveModal'
  | 'setDeafened'
  | 'setMuted'
  | 'users'
>

const categoryLabels: Record<ChannelCategory, string> = {
  information: 'ИНФОРМАЦИЯ',
  text: 'ТЕКСТОВЫЕ КАНАЛЫ',
  voice: 'ГОЛОСОВЫЕ КАНАЛЫ',
  events: 'СОБЫТИЯ',
  private: 'ПРИВАТНЫЕ',
}

const categoryOrder: ChannelCategory[] = ['information', 'text', 'voice']

function ChannelIcon({ isPrivate, type }: { isPrivate: boolean; type: ChannelType }) {
  if (isPrivate) return <Lock size={17} />
  if (type === 'voice') return <Volume2 size={17} />
  return <Hash size={17} />
}

export function ChannelSidebar(props: Props) {
  const { activeChannelId, activeServer, selectChannel, setActiveModal } = props
  const voiceUsers = props.users.filter((user) => ['u9', 'u5', 'u4'].includes(user.id))

  return (
    <aside className="channel-sidebar">
      <header className="server-header">
        <button type="button" onClick={() => selectChannel(`${activeServer.id}-general`)}>
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
          const channels = activeServer.channels.filter((channel) => channel.category === category)

          return (
            <section className="channel-group" key={category}>
              <div className="channel-group-title">
                <span>{categoryLabels[category]}</span>
                <button type="button" onClick={() => setActiveModal('createChannel')} title="Создать канал">
                  <Plus size={15} />
                </button>
              </div>
              {channels.map((channel) => (
                <div key={channel.id}>
                  <button
                    className={`channel-row ${channel.id === activeChannelId ? 'is-active' : ''}`}
                    type="button"
                    onClick={() => selectChannel(channel.id)}
                  >
                    <ChannelIcon isPrivate={channel.isPrivate} type={channel.type} />
                    <span>{channel.name}</span>
                    {channel.unreadCount ? <strong>{channel.unreadCount}</strong> : null}
                    {channel.name === 'Gaming' ? <em>LIVE</em> : null}
                  </button>
                  {channel.name === 'Gaming' ? (
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
      </nav>

      <UserProfileBar {...props} />
    </aside>
  )
}
