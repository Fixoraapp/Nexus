import { AtSign, Hash, Pin, Search, Settings, Users, Volume2 } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { NotificationBell } from './NotificationBell'

type Props = Pick<
  NexusStore,
  'activeChannel' | 'membersVisible' | 'notifications' | 'search' | 'setActiveModal' | 'setMembersVisible' | 'setSearch'
>

export function ChatHeader({ activeChannel, membersVisible, notifications, search, setActiveModal, setMembersVisible, setSearch }: Props) {
  const isVoice = activeChannel?.type === 'voice'

  return (
    <header className="chat-header">
      <div className="chat-title">
        {isVoice ? <Volume2 size={24} /> : <Hash size={24} />}
        <div>
          <h1>{activeChannel?.name ?? 'general'}</h1>
          <p>{activeChannel?.description ?? 'Общий чат для всех участников сервера.'}</p>
        </div>
      </div>
      <div className="chat-tools">
        <label className="search-field">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск" />
        </label>
        <button className="icon-button" type="button" title="Закреплённые">
          <Pin size={19} />
        </button>
        <NotificationBell notifications={notifications} />
        <button className="icon-button" type="button" title="Упоминания">
          <AtSign size={19} />
        </button>
        <button className={`icon-button ${membersVisible ? 'is-on' : ''}`} type="button" onClick={() => setMembersVisible(!membersVisible)} title="Участники">
          <Users size={19} />
        </button>
        <button className="icon-button" type="button" onClick={() => setActiveModal('settings')} title="Настройки">
          <Settings size={19} />
        </button>
      </div>
    </header>
  )
}
