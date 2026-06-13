import { useEffect, useRef } from 'react'
import type { Message, Role, User } from '../types'
import { ChatMessage } from './ChatMessage'

type Props = {
  addReaction: (messageId: string, emoji: string) => void
  channelName: string
  deleteMessage: (messageId: string) => void
  editMessage: (messageId: string, content: string) => void
  messages: Message[]
  roles: Role[]
  users: User[]
}

export function MessageList({ addReaction, channelName, deleteMessage, editMessage, messages, roles, users }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  if (!messages.length) {
    return (
      <section className="text-channel-empty">
        <span>#</span>
        <h2>Это начало канала #{channelName}</h2>
        <p>Напишите первое сообщение</p>
      </section>
    )
  }

  return (
    <section className="message-list pro-message-list">
      {messages.map((message) => (
        <ChatMessage
          addReaction={addReaction}
          deleteMessage={deleteMessage}
          editMessage={editMessage}
          key={message.id}
          message={message}
          roles={roles}
          users={users}
        />
      ))}
      <div ref={bottomRef} />
    </section>
  )
}
