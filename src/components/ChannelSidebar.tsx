import { Calendar, ChevronDown, Compass, Hash, Lock, MessageCircle, Plus, Volume2 } from 'lucide-react'
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

const categoryOrder: ChannelCategory[] = ['information', 'text', 'voice', 'events', 'private']

function ChannelIcon({ isPrivate, type }: { isPrivate: boolean; type: ChannelType }) {
  if (isPrivate) return <Lock size={16} />
  if (type === 'voice') return <Volume2 size={16} />
  if (type === 'event') return <Calendar size={16} />
  if (type === 'forum') return <MessageCircle size={16} />
  return <Hash size={16} />
}

export function ChannelSidebar(props: Props) {
  const { activeChannelId, activeServer, selectChannel, setActiveModal } = props

  return (
    <aside className="channel-sidebar">
      <header className="server-header">
        <button type="button" onClick={() => selectChannel('home')}>
          <span>{activeServer.name}</span>
          <ChevronDown size={16} />
        </button>
      </header>

      <button className="browse-channels" type="button">
        <Compass size={16} />
        Обзор каналов
      </button>

      <nav className="channel-groups" aria-label="Каналы">
        {categoryOrder.map((category) => {
          const channels = activeServer.channels.filter((channel) => channel.category === category)

          return (
            <section className="channel-group" key={category}>
              <div className="channel-group-title">
                <span>{categoryLabels[category]}</span>
                <button type="button" onClick={() => setActiveModal('createChannel')} title="Создать канал">
                  <Plus size={14} />
                </button>
              </div>
              {channels.map((channel) => (
                <button
                  className={`channel-row ${channel.id === activeChannelId ? 'is-active' : ''}`}
                  key={channel.id}
                  type="button"
                  onClick={() => selectChannel(channel.id)}
                >
                  <ChannelIcon isPrivate={channel.isPrivate} type={channel.type} />
                  <span>{channel.name}</span>
                  {channel.unreadCount ? <strong>{channel.unreadCount}</strong> : null}
                </button>
              ))}
            </section>
          )
        })}
      </nav>

      <UserProfileBar {...props} />
    </aside>
  )
}
