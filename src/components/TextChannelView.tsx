import { Bell, Hash, Pin, Search, Settings, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { NexusStore } from '../store/nexusStore'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

type Props = Pick<
  NexusStore,
  | 'activeChannel'
  | 'addReaction'
  | 'channelMessages'
  | 'deleteMessage'
  | 'editMessage'
  | 'membersVisible'
  | 'roles'
  | 'sendMessage'
  | 'serverUsers'
  | 'setActiveModal'
  | 'setMembersVisible'
  | 'users'
>

export function TextChannelView({ activeChannel, addReaction, channelMessages, deleteMessage, editMessage, membersVisible, roles, sendMessage, serverUsers, setActiveModal, setMembersVisible, users }: Props) {
  const [query, setQuery] = useState('')
  const visibleUsers = serverUsers.length ? serverUsers : users
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return channelMessages.filter((message) => message.content.toLowerCase().includes(normalized)).slice(0, 6)
  }, [channelMessages, query])

  if (!activeChannel) return null

  return (
    <main className="text-channel-view">
      <header className="channel-view-header">
        <div className="channel-view-title">
          <Hash size={24} />
          <div>
            <h1>{activeChannel.name}</h1>
            <p>{activeChannel.description || 'Канал сообщества'}</p>
          </div>
        </div>
        <div className="channel-view-tools">
          <label className="channel-search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск" />
            {results.length ? (
              <div className="search-results-popover">
                {results.map((message) => (
                  <button key={message.id} type="button" onClick={() => document.getElementById(`message-${message.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
                    {message.content}
                  </button>
                ))}
              </div>
            ) : null}
          </label>
          <button className="icon-button" type="button" title="Закрепленные"><Pin size={18} /></button>
          <button className="icon-button" type="button" title="Уведомления"><Bell size={18} /></button>
          <button className={`icon-button ${membersVisible ? 'is-on' : ''}`} type="button" onClick={() => setMembersVisible(!membersVisible)} title="Участники"><Users size={18} /></button>
          <button className="icon-button" type="button" onClick={() => setActiveModal('settings')} title="Настройки"><Settings size={18} /></button>
        </div>
      </header>

      <MessageList
        addReaction={addReaction}
        channelName={activeChannel.name}
        deleteMessage={deleteMessage}
        editMessage={editMessage}
        messages={channelMessages}
        roles={roles}
        users={visibleUsers}
      />
      <MessageComposer channelName={activeChannel.name} sendMessage={(content) => sendMessage(activeChannel.id, content)} />
    </main>
  )
}
