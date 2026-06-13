import { useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Copy, MessageCircle, Search, Server, UserPlus, Users } from 'lucide-react'
import { AddServerModal } from '../components/AddServerModal'
import { ActivityModal } from '../components/ActivityModal'
import { ChannelSidebar } from '../components/ChannelSidebar'
import { ChatHeader } from '../components/ChatHeader'
import { ChatMessage } from '../components/ChatMessage'
import { CreateChannelModal } from '../components/CreateChannelModal'
import { JoinServerModal } from '../components/JoinServerModal'
import { MembersPanel } from '../components/MembersPanel'
import { MessageComposer } from '../components/MessageComposer'
import { ServerRail } from '../components/ServerRail'
import { SettingsModal } from '../components/SettingsModal'
import { UserProfileModal } from '../components/UserProfileModal'
import { VoiceRoom } from '../components/VoiceRoom'
import { useNexusStore } from '../store/nexusStore'
import { clearSession } from '../utils/authSession'

export function NexusAppLayout() {
  const location = useLocation()
  const { channelId, serverId } = useParams()
  const store = useNexusStore(serverId ?? '', channelId ?? '')
  const isFeaturePath = ['/friends', '/dm', '/settings'].some((path) => location.pathname.endsWith(path))

  if (serverId && !store.servers.some((server) => server.id === serverId)) {
    return <Navigate to="/app" replace />
  }

  const renderMain = () => {
    if (location.pathname.endsWith('/friends')) return <FriendsSurface {...store} />
    if (location.pathname.endsWith('/dm')) return <DirectMessagesSurface {...store} />
    if (location.pathname.endsWith('/settings')) return <SettingsSurface {...store} />
    if (!store.activeServer || store.activeChannelId === 'home') return <OnboardingSurface {...store} />
    if (store.activeChannel?.type === 'voice') return <VoiceRoom {...store} />

    return (
      <main className="chat-main">
        {store.channelMessages.length ? (
          <section className="message-list">
            {store.channelMessages.map((message) => (
              <ChatMessage
                addReaction={store.addReaction}
                deleteMessage={store.deleteMessage}
                editMessage={store.editMessage}
                key={message.id}
                message={message}
                roles={store.roles}
                users={store.serverUsers.length ? store.serverUsers : store.users}
              />
            ))}
          </section>
        ) : (
          <section className="real-empty-state">
            <span><MessageCircle size={34} /></span>
            <h2>Сообщений пока нет</h2>
            <p>Напишите первое сообщение в этом канале. Здесь будут только реальные сообщения.</p>
          </section>
        )}
        <MessageComposer channelName={store.activeChannel?.name ?? 'general'} sendMessage={store.sendMessage} />
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
          {store.activeServer && store.membersVisible && !isFeaturePath ? <MembersPanel {...store} /> : null}
        </div>
      </section>

      {store.activeModal === 'addServer' ? <AddServerModal {...store} /> : null}
      {store.activeModal === 'activity' ? <ActivityModal {...store} /> : null}
      {store.activeModal === 'createChannel' ? <CreateChannelModal {...store} /> : null}
      {store.activeModal === 'joinServer' ? (
        <div className="add-server-overlay">
          <JoinServerModal
            joinServerByInvite={store.joinServerByInvite}
            onBack={store.openAddServerModal}
            onClose={() => store.setActiveModal(null)}
          />
        </div>
      ) : null}
      {store.activeModal === 'settings' ? <SettingsModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
      {store.activeModal === 'profile' ? <UserProfileModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
      {store.toast ? <div className="nexus-toast">{store.toast}</div> : null}
    </div>
  )
}

function OnboardingSurface({ currentUser, openAddServerModal, servers, setActiveModal, showSoon }: ReturnType<typeof useNexusStore>) {
  const hasServers = servers.length > 0

  return (
    <main className="feature-surface onboarding-surface">
      <section className="real-welcome-panel">
        <span className="nexus-icon">N</span>
        <p className="eyebrow">Nexus Desktop</p>
        <h1>Добро пожаловать в Nexus{currentUser ? `, ${currentUser.displayName}` : ''}</h1>
        <p>{hasServers ? 'Выберите сервер слева или создайте новое пространство.' : 'У вас пока нет серверов. Создайте первое сообщество или присоединитесь по приглашению.'}</p>
        <div className="onboarding-actions">
          <button type="button" onClick={openAddServerModal}><Server size={18} />Создать свой сервер</button>
          <button type="button" onClick={() => setActiveModal('joinServer')}><Copy size={18} />Присоединиться по приглашению</button>
          <button type="button" onClick={() => showSoon()}><MessageCircle size={18} />Перейти в личные сообщения</button>
        </div>
        {hasServers ? <small>Invite для выбранного сервера можно создать в панели участников.</small> : null}
      </section>
    </main>
  )
}

function FriendsSurface(store: ReturnType<typeof useNexusStore>) {
  const [query, setQuery] = useState('')
  const results = store.searchUsers(query)
  const incoming = store.friendRequests.filter((request) => request.toUserId === store.currentUser?.id && request.status === 'pending')

  return (
    <main className="feature-surface friends-surface">
      <section className="feature-card-panel real-friends-panel">
        <header><h2>Друзья</h2><span><Search size={15} /></span></header>
        <div className="friends-real-layout">
          <section>
            <h3>Найти пользователя</h3>
            <label className="member-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="username или email" /></label>
            {results.map((user) => (
              <article key={user.id}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <div><strong>{user.displayName}</strong><small>@{user.username}</small></div>
                <button type="button" onClick={() => store.sendFriendRequest(user.id)}><UserPlus size={15} />Добавить</button>
              </article>
            ))}
          </section>
          <section>
            <h3>Запросы</h3>
            {incoming.map((request) => {
              const user = store.users.find((item) => item.id === request.fromUserId)
              return user ? (
                <article key={request.id}>
                  <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                  <div><strong>{user.displayName}</strong><small>@{user.username}</small></div>
                  <button type="button" onClick={() => store.acceptFriendRequest(request.id)}>Принять</button>
                  <button type="button" onClick={() => store.declineFriendRequest(request.id)}>Отклонить</button>
                </article>
              ) : null
            })}
            {!incoming.length ? <p>Новых запросов нет.</p> : null}
          </section>
          <section>
            <h3>Мои друзья</h3>
            {store.friends.map((user) => (
              <article key={user.id}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <div><strong>{user.displayName}</strong><small>@{user.username}</small></div>
                <button type="button" onClick={() => store.startDirectChat(user.id)}>DM</button>
              </article>
            ))}
            {!store.friends.length ? <p>Список друзей пока пуст.</p> : null}
          </section>
        </div>
      </section>
    </main>
  )
}

function DirectMessagesSurface(store: ReturnType<typeof useNexusStore>) {
  const [draft, setDraft] = useState('')
  const activeChat = store.directChats.find((chat) => chat.id === store.settings.activeDmId) ?? store.directChats[0]
  const friend = activeChat?.participantIds.map((id) => store.users.find((user) => user.id === id)).find((user) => user && user.id !== store.currentUser?.id)

  const submit = () => {
    if (activeChat) {
      store.sendDirectMessage(activeChat.id, draft)
      setDraft('')
    }
  }

  return (
    <main className="feature-surface dm-surface">
      <section className="feature-card-panel real-dm-panel">
        <header><h2>Личные сообщения</h2><span><Users size={15} /></span></header>
        <div className="dm-real-layout">
          <aside>
            {store.friends.map((user) => (
              <button key={user.id} type="button" onClick={() => store.startDirectChat(user.id)}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <span><strong>{user.displayName}</strong><small>@{user.username}</small></span>
              </button>
            ))}
            {!store.friends.length ? <p>Добавьте друга, чтобы начать DM.</p> : null}
          </aside>
          <section>
            {activeChat && friend ? (
              <>
                <header><span className={`avatar avatar-${friend.status}`}>{friend.avatar}</span><strong>{friend.displayName}</strong></header>
                <div className="dm-message-list">
                  {activeChat.messages.map((message) => {
                    const author = store.users.find((user) => user.id === message.authorId)
                    return <article className={message.authorId === store.currentUser?.id ? 'is-own' : ''} key={message.id}><p>{message.content}<small>{message.timestamp}</small></p><span className={`avatar avatar-${author?.status ?? 'online'}`}>{author?.avatar ?? 'N'}</span></article>
                  })}
                </div>
                <div className="dm-composer real-dm-composer">
                  <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => {
                    if (event.key === 'Enter') submit()
                  }} placeholder={`Написать @${friend.username}`} />
                  <button type="button" onClick={submit}>Отправить</button>
                </div>
              </>
            ) : (
              <div className="real-empty-state"><h2>Выберите диалог</h2><p>DM создаются только с реальными друзьями.</p></div>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}

function SettingsSurface({ currentUser }: ReturnType<typeof useNexusStore>) {
  const logout = () => {
    clearSession()
    window.location.hash = '#/login'
  }

  return (
    <main className="feature-surface settings-route-surface">
      <section className="feature-card-panel settings-page-panel">
        <aside>
          {['Мой аккаунт', 'Профиль', 'Внешний вид', 'Уведомления', 'Голос и видео', 'Приватность'].map((item, index) => (
            <button className={index === 1 ? 'is-active' : ''} key={item} type="button">{item}</button>
          ))}
        </aside>
        <section>
          <h2>Настройки пользователя</h2>
          <div className="settings-profile"><span className="avatar avatar-online">{currentUser?.avatar ?? 'N'}</span><div><strong>{currentUser?.displayName ?? 'Nexus User'}</strong><button type="button">Изменить аватар</button></div></div>
          <label>Отображаемое имя<input defaultValue={currentUser?.displayName ?? ''} /></label>
          <label>Username<input defaultValue={currentUser?.username ?? ''} /></label>
          <label>Email<input defaultValue={currentUser?.email ?? ''} /></label>
          <button className="logout-button" type="button" onClick={logout}>Выйти из аккаунта</button>
        </section>
      </section>
    </main>
  )
}
