import { Navigate, useParams } from 'react-router-dom'
import { ChannelSidebar } from '../components/ChannelSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessage } from '../components/ChatMessage'
import { CreateChannelModal } from '../components/CreateChannelModal'
import { CreateServerModal } from '../components/CreateServerModal'
import { DashboardHome } from '../components/DashboardHome'
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
  const store = useNexusStore(serverId ?? 'nexus', channelId ?? 'home')

  if (serverId && !store.servers.some((server) => server.id === serverId)) {
    return <Navigate to="/app" replace />
  }

  const renderMain = () => {
    if (!store.activeChannel || store.activeChannelId === 'home') {
      return <DashboardHome {...store} />
    }

    if (store.activeChannel.type === 'voice') {
      return <VoiceRoom {...store} />
    }

    if (store.activeChannel.type === 'event') {
      return <EmptyState title="Календарь событий" description="Здесь появятся встречи, релизы и планы сообщества." />
    }

    return (
      <main className="chat-main">
        <section className="pinned-card">
          <strong>Закреплено администратором</strong>
          <p>Добро пожаловать в Nexus. Прочитайте правила и расскажите о себе в #welcome.</p>
        </section>
        <section className="message-list">
          {store.channelMessages.map((message) => (
            <ChatMessage addReaction={store.addReaction} key={message.id} message={message} roles={store.roles} users={store.users} />
          ))}
          <p className="typing-indicator">Майя печатает...</p>
        </section>
        <MessageComposer channelName={store.activeChannel.name} sendMessage={store.sendMessage} />
      </main>
    )
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
