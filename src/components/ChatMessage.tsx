import { Edit, MoreHorizontal, Reply, Smile, Trash2 } from 'lucide-react'
import type { Message, Role, User } from '../types'

type Props = {
  addReaction: (messageId: string, emoji: string) => void
  message: Message
  roles: Role[]
  users: User[]
}

export function ChatMessage({ addReaction, message, roles, users }: Props) {
  const author = users.find((user) => user.id === message.authorId) ?? users[0]
  const role = roles
    .filter((item) => author.roleIds.includes(item.id))
    .sort((a, b) => b.priority - a.priority)[0]
  const replyAuthor = message.replyTo
    ? users.find((user) => user.id === users.find((candidate) => candidate.id === message.authorId)?.id)
    : null

  return (
    <article className="chat-message">
      <span className={`avatar avatar-${author.status}`}>{author.avatar}</span>
      <div className="message-body">
        {message.replyTo ? <div className="reply-preview">Ответ на сообщение {replyAuthor?.displayName ?? 'участника'}</div> : null}
        <div className="message-meta">
          <strong>{author.displayName}</strong>
          {role ? <span style={{ color: role.color }}>{role.name}</span> : null}
          <time>{message.timestamp}</time>
          {message.edited ? <em>изменено</em> : null}
        </div>
        <p>{message.content}</p>
        {message.reactions.length ? (
          <div className="reaction-list">
            {message.reactions.map((reaction) => (
              <button key={reaction.emoji} type="button" onClick={() => addReaction(message.id, reaction.emoji)}>
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="message-actions">
        <button type="button" title="Ответить"><Reply size={15} /></button>
        <button type="button" onClick={() => addReaction(message.id, '👍')} title="Реакция"><Smile size={15} /></button>
        <button type="button" title="Изменить"><Edit size={15} /></button>
        <button type="button" title="Удалить"><Trash2 size={15} /></button>
        <button type="button" title="Еще"><MoreHorizontal size={15} /></button>
      </div>
    </article>
  )
}
