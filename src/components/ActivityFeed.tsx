import type { Message, User } from '../types'

type Props = {
  messages: Message[]
  users: User[]
}

export function ActivityFeed({ messages, users }: Props) {
  return (
    <section className="activity-feed app-card">
      <h2>Последняя активность</h2>
      {messages.slice(-5).reverse().map((message) => {
        const user = users.find((item) => item.id === message.authorId) ?? users[0]
        return (
          <div className="activity-row" key={message.id}>
            <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
            <div>
              <strong>{user.displayName}</strong>
              <p>{message.content}</p>
            </div>
            <time>{message.timestamp}</time>
          </div>
        )
      })}
    </section>
  )
}
