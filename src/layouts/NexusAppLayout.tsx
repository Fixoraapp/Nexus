import { useState } from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Activity, Bell, Check, Compass, Copy, Hash, MessageCircle, Plus, Search, Server, ShieldCheck, Sparkles, UserCheck, UserPlus, Users } from 'lucide-react'
import { AddServerModal } from '../components/AddServerModal'
import { ActivityModal } from '../components/ActivityModal'
import { ChannelSidebar } from '../components/ChannelSidebar'
import { ChatMessage } from '../components/ChatMessage'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { CreateCategoryModal } from '../components/CreateCategoryModal'
import { CreateChannelModal } from '../components/CreateChannelModal'
import { CreateEventModal } from '../components/CreateEventModal'
import { InviteServerModal } from '../components/InviteServerModal'
import { JoinServerModal } from '../components/JoinServerModal'
import { MembersPanel } from '../components/MembersPanel'
import { MessageComposer } from '../components/MessageComposer'
import { ServerPrivacyModal } from '../components/ServerPrivacyModal'
import { ServerProfileModal } from '../components/ServerProfileModal'
import { ServerRail } from '../components/ServerRail'
import { ServerSettingsModal } from '../components/ServerSettingsModal'
import { SettingsModal } from '../components/SettingsModal'
import { TextChannelView } from '../components/TextChannelView'
import { VoiceChannelView } from '../components/VoiceChannelView'
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
    if (store.activeChannel?.type === 'voice') return <VoiceChannelView {...store} />
    return <TextChannelView {...store} />

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
        <div className="workspace-body">
          {renderMain()}
          {store.activeServer && store.membersVisible && !isFeaturePath ? <MembersPanel {...store} /> : null}
        </div>
      </section>

      {store.activeModal === 'addServer' ? <AddServerModal {...store} /> : null}
      {store.activeModal === 'activity' ? <ActivityModal {...store} /> : null}
      {store.activeModal === 'confirmLeaveServer' && store.activeServer ? (
        <ConfirmDialog
          confirmText="Покинуть сервер"
          message={`Вы уверены, что хотите покинуть ${store.activeServer.name}?`}
          onCancel={() => store.setActiveModal(null)}
          onConfirm={() => store.leaveServer(store.activeServer?.id ?? '')}
          title="Покинуть сервер"
        />
      ) : null}
      {store.activeModal === 'createCategory' ? <CreateCategoryModal {...store} /> : null}
      {store.activeModal === 'createChannel' ? <CreateChannelModal {...store} /> : null}
      {store.activeModal === 'createEvent' ? <CreateEventModal {...store} /> : null}
      {store.activeModal === 'inviteServer' ? <InviteServerModal {...store} /> : null}
      {store.activeModal === 'isolation' && store.activeServer ? (
        <ConfirmDialog
          confirmText="Понятно"
          message="Изоляция сервера подготовлена как backend-ready действие. Подключение жестких moderation policy будет следующим этапом."
          onCancel={() => store.setActiveModal(null)}
          onConfirm={() => {
            store.showToast('Изоляция сервера будет доступна после подключения moderation backend')
            store.setActiveModal(null)
          }}
          title="Изоляция сервера"
        />
      ) : null}
      {store.activeModal === 'joinServer' ? (
        <div className="add-server-overlay">
          <JoinServerModal
            joinServerByInvite={store.joinServerByInvite}
            onBack={store.openAddServerModal}
            onClose={() => store.setActiveModal(null)}
          />
        </div>
      ) : null}
      {store.activeModal === 'serverPrivacy' ? <ServerPrivacyModal {...store} /> : null}
      {store.activeModal === 'serverProfile' ? <ServerProfileModal {...store} /> : null}
      {store.activeModal === 'serverSettings' ? <ServerSettingsModal {...store} /> : null}
      {store.activeModal === 'settings' ? <SettingsModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
      {store.toast ? <div className="nexus-toast">{store.toast}</div> : null}
    </div>
  )
}

function OnboardingSurface(store: ReturnType<typeof useNexusStore>) {
  const [friendQuery, setFriendQuery] = useState('')
  const {
    currentActivity,
    currentUser,
    directChats,
    friendRequests,
    friends,
    openAddServerModal,
    searchUsers,
    sendFriendRequest,
    servers,
    setActiveModal,
    showSoon,
    startDirectChat,
  } = store
  const hasServers = servers.length > 0
  const pendingIncoming = friendRequests.filter((request) => request.toUserId === currentUser?.id && request.status === 'pending')
  const searchResults = searchUsers(friendQuery).slice(0, 5)
  const recentFriends = friends.slice(0, 4)
  const onlineFriends = friends.filter((friend) => friend.status !== 'offline').length
  const totalChannels = servers.reduce((count, server) => count + server.channels.length, 0)
  const openFriends = () => {
    window.location.hash = '#/app/friends'
  }
  const openDm = (userId?: string) => {
    if (userId) startDirectChat(userId)
    window.location.hash = '#/app/dm'
  }

  return (
    <main className="feature-surface onboarding-surface nexus-home">
      <section className="home-command-bar">
        <div>
          <span className="nexus-icon">N</span>
          <span>
            <strong>Nexus</strong>
            <small>{currentUser ? `@${currentUser.username}` : 'desktop workspace'}</small>
          </span>
        </div>
        <label className="home-friend-search">
          <Search size={16} />
          <input value={friendQuery} onChange={(event) => setFriendQuery(event.target.value)} placeholder="Найти друга по имени, username или email" />
        </label>
        <button type="button" onClick={openFriends}><Users size={17} />Друзья</button>
      </section>

      <section className="home-hero-panel">
        <div className="home-hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> Nexus Desktop</p>
          <h1>Добро пожаловать{currentUser ? `, ${currentUser.displayName}` : ''}</h1>
          <p>{hasServers ? 'Выберите сервер слева, найдите друзей или продолжайте общение в личных сообщениях.' : 'Создайте первое пространство, присоединитесь по invite-коду или найдите друзей для личного общения.'}</p>
          <div className="home-primary-actions">
            <button type="button" onClick={openAddServerModal}><Plus size={18} />Создать сервер</button>
            <button type="button" onClick={() => setActiveModal('joinServer')}><Copy size={18} />Ввести invite</button>
            <button type="button" onClick={() => openDm()}><MessageCircle size={18} />Открыть DM</button>
          </div>
        </div>
        <div className="home-status-grid">
          <article><Server size={18} /><strong>{servers.length}</strong><small>серверов</small></article>
          <article><Hash size={18} /><strong>{totalChannels}</strong><small>каналов</small></article>
          <article><Users size={18} /><strong>{friends.length}</strong><small>друзей</small></article>
          <article><Bell size={18} /><strong>{pendingIncoming.length}</strong><small>заявок</small></article>
        </div>
      </section>

      <section className="home-grid">
        <section className="home-panel home-search-panel">
          <header>
            <h2>Поиск людей</h2>
            <button type="button" onClick={openFriends}>Все друзья</button>
          </header>
          {friendQuery.trim() ? (
            <div className="home-user-list">
              {searchResults.map((user) => {
                const isFriend = friends.some((friend) => friend.id === user.id)
                const pending = friendRequests.some((request) => request.fromUserId === currentUser?.id && request.toUserId === user.id && request.status === 'pending')
                return (
                  <article key={user.id}>
                    <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                    <div><strong>{user.displayName}</strong><small>@{user.username} · {user.email}</small></div>
                    {isFriend ? (
                      <button type="button" onClick={() => openDm(user.id)}><MessageCircle size={15} />DM</button>
                    ) : (
                      <button disabled={pending} type="button" onClick={() => sendFriendRequest(user.id)}>
                        {pending ? <Check size={15} /> : <UserPlus size={15} />}
                        {pending ? 'Отправлено' : 'Добавить'}
                      </button>
                    )}
                  </article>
                )
              })}
              {!searchResults.length ? <p>Ничего не найдено. Проверьте username или email.</p> : null}
            </div>
          ) : (
            <div className="home-empty-card">
              <Search size={24} />
              <strong>Начните вводить имя</strong>
              <small>Поиск работает по отображаемому имени, username и email.</small>
            </div>
          )}
        </section>

        <section className="home-panel">
          <header>
            <h2>Быстрый доступ</h2>
            <span><Activity size={16} /></span>
          </header>
          <div className="home-action-list">
            <button type="button" onClick={openAddServerModal}><Server size={18} /><span><strong>Новый сервер</strong><small>Создать пространство для друзей или команды</small></span></button>
            <button type="button" onClick={() => setActiveModal('joinServer')}><Compass size={18} /><span><strong>Присоединиться</strong><small>Войти по invite-коду</small></span></button>
            <button type="button" onClick={() => setActiveModal('activity')}><Activity size={18} /><span><strong>Активность</strong><small>{currentActivity?.name || 'Выбрать статус вручную'}</small></span></button>
            <button type="button" onClick={() => showSoon('Обзор сообществ скоро будет доступен')}><ShieldCheck size={18} /><span><strong>Обзор сообществ</strong><small>Найти публичные пространства</small></span></button>
          </div>
        </section>

        <section className="home-panel">
          <header>
            <h2>Друзья онлайн</h2>
            <strong>{onlineFriends}</strong>
          </header>
          <div className="home-user-list compact">
            {recentFriends.map((friend) => (
              <article key={friend.id}>
                <span className={`avatar avatar-${friend.status}`}>{friend.avatar}</span>
                <div><strong>{friend.displayName}</strong><small>{friend.activity}</small></div>
                <button type="button" onClick={() => openDm(friend.id)}><MessageCircle size={15} /></button>
              </article>
            ))}
            {!recentFriends.length ? (
              <div className="home-empty-card">
                <UserCheck size={24} />
                <strong>Список друзей пуст</strong>
                <small>Найдите пользователя сверху и отправьте заявку.</small>
              </div>
            ) : null}
          </div>
        </section>

        <section className="home-panel">
          <header>
            <h2>Сервера</h2>
            <strong>{servers.length}</strong>
          </header>
          <div className="home-server-list">
            {servers.slice(0, 5).map((server) => (
              <button key={server.id} type="button" onClick={() => {
                const channel = server.channels.find((item) => item.type === 'text') ?? server.channels[0]
                window.location.hash = channel ? `#/app/server/${server.id}/channel/${channel.id}` : '#/app'
              }}>
                <span>{server.icon}</span>
                <div><strong>{server.name}</strong><small>{server.memberCount} участников · {server.onlineCount} онлайн</small></div>
              </button>
            ))}
            {!servers.length ? <div className="home-empty-card"><Server size={24} /><strong>Нет серверов</strong><small>Создайте свой или присоединитесь по invite.</small></div> : null}
          </div>
        </section>

        <section className="home-panel home-wide-panel">
          <header>
            <h2>Личные сообщения</h2>
            <button type="button" onClick={() => openDm()}>Открыть</button>
          </header>
          <div className="home-dm-strip">
            {directChats.slice(0, 4).map((chat) => {
              const friend = chat.participantIds.map((id) => store.users.find((user) => user.id === id)).find((user) => user && user.id !== currentUser?.id)
              const lastMessage = chat.messages.at(-1)
              return friend ? (
                <button key={chat.id} type="button" onClick={() => openDm(friend.id)}>
                  <span className={`avatar avatar-${friend.status}`}>{friend.avatar}</span>
                  <div><strong>{friend.displayName}</strong><small>{lastMessage?.content || 'Начать переписку'}</small></div>
                </button>
              ) : null
            })}
            {!directChats.length ? <p>DM пока нет. Добавьте друга и начните переписку.</p> : null}
          </div>
        </section>
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
