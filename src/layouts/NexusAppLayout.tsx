import { Navigate, useParams } from 'react-router-dom'
import { Pin, Search, Users, X } from 'lucide-react'
import { ChannelSidebar } from '../components/ChannelSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessage } from '../components/ChatMessage'
import { CreateChannelModal } from '../components/CreateChannelModal'
import { CreateServerModal } from '../components/CreateServerModal'
import { EmptyState } from '../components/EmptyState'
import { MembersPanel } from '../components/MembersPanel'
import { MessageComposer } from '../components/MessageComposer'
import { ServerRail } from '../components/ServerRail'
import { SettingsModal } from '../components/SettingsModal'
import { UserProfileModal } from '../components/UserProfileModal'
import { VoiceRoom } from '../components/VoiceRoom'
import { useNexusStore } from '../store/nexusStore'

export function NexusAppLayout() {
  const { channelId, serverId } = useParams()
  const store = useNexusStore(serverId ?? 'nexus', channelId ?? 'nexus-general')

  if (serverId && !store.servers.some((server) => server.id === serverId)) {
    return <Navigate to="/app" replace />
  }

  const renderMain = () => {
    if (!store.activeChannel || store.activeChannel.type === 'text' || store.activeChannel.type === 'forum') {
      return (
        <main className="chat-main">
          <section className="pinned-card">
            <div className="pinned-toolbar">
              <div className="pinned-heading">
                <Pin size={18} />
                <strong>Закреплённое сообщение</strong>
              </div>
              <div className="pinned-actions">
                <Users size={17} />
                <Pin size={17} />
                <Search size={17} />
                <X size={17} />
              </div>
            </div>
            <div className="pinned-message">
              <span className="avatar avatar-online">AJ</span>
              <p>
                <b>Алекс Джонсон</b> <small>10.06.2026</small>
                <br />
                Добро пожаловать в Nexus Community! 🎉 Ознакомьтесь с правилами и не стесняйтесь задавать вопросы.
              </p>
            </div>
          </section>

          <section className="message-list">
            {store.channelMessages.map((message) => (
              <ChatMessage
                addReaction={store.addReaction}
                deleteMessage={store.deleteMessage}
                editMessage={store.editMessage}
                key={message.id}
                message={message}
                roles={store.roles}
                users={store.users}
              />
            ))}
            <p className="typing-indicator">••• Ной Уилсон печатает...</p>
          </section>

          <MessageComposer channelName={store.activeChannel?.name ?? 'general'} sendMessage={store.sendMessage} />
        </main>
      )
    }

    if (store.activeChannel.type === 'voice') {
      return <VoiceRoom {...store} />
    }

    return <EmptyState title="Календарь событий" description="Здесь появятся встречи, релизы и планы сообщества." />
  }

  return (
    <div className="nexus-shell">
      <ServerRail {...store} />
      <ChannelSidebar {...store} />
      <section className="workspace">
        <ChatHeader {...store} />
        <div className="workspace-body">
          {renderMain()}
          {store.membersVisible ? <MembersPanel roles={store.roles} setActiveModal={store.setActiveModal} users={store.users} /> : null}
        </div>
      </section>

      {store.activeModal === 'createServer' ? <CreateServerModal setActiveModal={store.setActiveModal} /> : null}
      {store.activeModal === 'createChannel' ? <CreateChannelModal setActiveModal={store.setActiveModal} /> : null}
      {store.activeModal === 'settings' ? <SettingsModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
      {store.activeModal === 'profile' ? <UserProfileModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
    </div>
  )
}
