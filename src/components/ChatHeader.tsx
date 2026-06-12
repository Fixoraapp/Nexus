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
        {isVoice ? <Volume2 size={20} /> : <Hash size={20} />}
        <div>
          <h1>{activeChannel?.name ?? 'Главная'}</h1>
          <p>{activeChannel?.description ?? 'Панель управления сообществом Nexus.'}</p>
        </div>
      </div>
      <div className="chat-tools">
        <label className="search-field">
          <Search size={16} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск" />
        </label>
        <button className="icon-button" type="button" title="Закрепленные">
          <Pin size={18} />
        </button>
        <NotificationBell notifications={notifications} />
        <button className="icon-button" type="button" title="Личные сообщения">
          <AtSign size={18} />
        </button>
        <button className={`icon-button ${membersVisible ? 'is-on' : ''}`} type="button" onClick={() => setMembersVisible(!membersVisible)} title="Участники">
          <Users size={18} />
        </button>
        <button className="icon-button" type="button" onClick={() => setActiveModal('settings')} title="Настройки">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
