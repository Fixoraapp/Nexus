import { Edit, MoreHorizontal, Reply, Smile, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Message, Role, User } from '../types'

type Props = {
  addReaction: (messageId: string, emoji: string) => void
  deleteMessage: (messageId: string) => void
  editMessage: (messageId: string, content: string) => void
  message: Message
  roles: Role[]
  users: User[]
}

export function ChatMessage({ addReaction, deleteMessage, editMessage, message, roles, users }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)
  const author = users.find((user) => user.id === message.authorId) ?? users[0]
  const role = author
    ? roles.filter((item) => author.roleIds.includes(item.id)).sort((a, b) => b.priority - a.priority)[0]
    : null

  const saveEdit = () => {
    editMessage(message.id, draft)
    setEditing(false)
  }

  if (!author) {
    return null
  }

  return (
    <article className="chat-message">
      <span className={`avatar avatar-${author.status}`}>{author.avatar}</span>
      <div className="message-body">
        {message.replyTo ? <div className="reply-preview"><Reply size={13} /> Ответ на сообщение</div> : null}
        <div className="message-meta">
          <strong>{author.displayName}</strong>
          {role ? <span className="role-badge" style={{ backgroundColor: `${role.color}2b`, color: role.color }}>{role.name}</span> : null}
          <time>{message.timestamp}</time>
          {message.edited ? <em>изменено</em> : null}
        </div>
        {editing ? (
          <div className="message-edit">
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} />
            <button type="button" onClick={saveEdit}>Сохранить</button>
            <button type="button" onClick={() => setEditing(false)}>Отмена</button>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
        <div className="reaction-list">
          {message.reactions.map((reaction) => (
            <button key={reaction.emoji} type="button" onClick={() => addReaction(message.id, reaction.emoji)}>
              {reaction.emoji} {reaction.count}
            </button>
          ))}
          <button className="reaction-add" type="button" onClick={() => addReaction(message.id, '+1')} title="Добавить реакцию">
            <Smile size={14} />
          </button>
        </div>
      </div>
      <div className="message-actions">
        <button type="button" title="Ответить"><Reply size={15} /></button>
        <button type="button" onClick={() => addReaction(message.id, '+1')} title="Реакция"><Smile size={15} /></button>
        <button type="button" onClick={() => setEditing(true)} title="Изменить"><Edit size={15} /></button>
        <button type="button" onClick={() => deleteMessage(message.id)} title="Удалить"><Trash2 size={15} /></button>
        <button type="button" title="Еще"><MoreHorizontal size={15} /></button>
      </div>
    </article>
  )
}
