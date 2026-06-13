import { Navigate, useLocation, useParams } from 'react-router-dom'
import { Copy, Database, GitBranch, Lock, MessageCircle, Mic, Monitor, Pin, Search, Server, UserPlus, Users, X } from 'lucide-react'
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
  const location = useLocation()
  const { channelId, serverId } = useParams()
  const store = useNexusStore(serverId ?? 'nexus', channelId ?? 'nexus-general')
  const isFeaturePath = ['/app/friends', '/app/dm', '/app/settings'].some((path) => location.pathname.endsWith(path.replace('/app', '')))

  if (serverId && !store.servers.some((server) => server.id === serverId)) {
    return <Navigate to="/app" replace />
  }

  const renderMain = () => {
    if (location.pathname.endsWith('/friends')) {
      return <FriendsSurface users={store.users} />
    }

    if (location.pathname.endsWith('/dm')) {
      return <DirectMessagesSurface users={store.users} />
    }

    if (location.pathname.endsWith('/settings')) {
      return <SettingsSurface users={store.users} />
    }

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
          {store.membersVisible && !isFeaturePath ? <MembersPanel roles={store.roles} setActiveModal={store.setActiveModal} users={store.users} /> : null}
        </div>
      </section>

      {store.activeModal === 'createServer' ? <CreateServerModal setActiveModal={store.setActiveModal} /> : null}
      {store.activeModal === 'createChannel' ? <CreateChannelModal setActiveModal={store.setActiveModal} /> : null}
      {store.activeModal === 'settings' ? <SettingsModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
      {store.activeModal === 'profile' ? <UserProfileModal setActiveModal={store.setActiveModal} users={store.users} /> : null}
    </div>
  )
}

function FriendsSurface({ users }: Pick<ReturnType<typeof useNexusStore>, 'users'>) {
  const online = users.filter((user) => user.status !== 'offline').slice(2, 7)

  return (
    <main className="feature-surface friends-surface">
      <section className="feature-card-panel">
        <header><h2>Друзья</h2><span><Search size={15} /><X size={15} /></span></header>
        <div className="friends-layout">
          <nav>
            {['Друзья', 'Все друзья', 'Запросы', 'В сети', 'Рекомендации'].map((item, index) => (
              <button className={index === 1 ? 'is-active' : ''} key={item} type="button">{item}</button>
            ))}
          </nav>
          <div>
            <h3>Запросы в друзья</h3>
            {users.slice(8, 10).map((user) => (
              <article key={user.id}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <div><strong>{user.displayName}</strong><small>{user.activity}</small></div>
                <button type="button">Принять</button>
                <button type="button">Отклонить</button>
              </article>
            ))}
            <h3>В сети — {online.length}</h3>
            {online.map((user) => (
              <article key={user.id}><span className={`avatar avatar-${user.status}`}>{user.avatar}</span><div><strong>{user.displayName}</strong><small>{user.activity}</small></div></article>
            ))}
          </div>
        </div>
      </section>
      <ArchitecturePanel />
    </main>
  )
}

function DirectMessagesSurface({ users }: Pick<ReturnType<typeof useNexusStore>, 'users'>) {
  const selected = users[8]
  const contacts = users.slice(8, 13)

  return (
    <main className="feature-surface dm-surface">
      <section className="feature-card-panel">
        <header><h2>Личные сообщения</h2><span><Search size={15} /><X size={15} /></span></header>
        <div className="dm-layout">
          <aside>
            <label><Search size={14} /><input placeholder="Найти или начать беседу" /></label>
            {contacts.map((user, index) => (
              <button className={index === 0 ? 'is-active' : ''} key={user.id} type="button">
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <span><strong>{user.displayName}</strong><small>{user.activity}</small></span>
              </button>
            ))}
          </aside>
          <section>
            <header><span className={`avatar avatar-${selected.status}`}>{selected.avatar}</span><strong>{selected.displayName}</strong></header>
            {['Привет! Как дела?', 'Всё отлично! А у тебя?', 'Тоже хорошо, спасибо! 👍', 'Хочешь зайти в голосовой канал позже?', 'Давай! Буду через 5 минут.'].map((text, index) => (
              <article className={index % 2 ? 'is-own' : ''} key={text}>
                <span className={`avatar avatar-${index % 2 ? 'online' : selected.status}`}>{index % 2 ? 'EB' : selected.avatar}</span>
                <p>{text}<small>{15 + index}:{index * 8 + 12}</small></p>
              </article>
            ))}
            <div className="dm-composer">Написать @{selected.displayName}</div>
          </section>
        </div>
      </section>
    </main>
  )
}

function SettingsSurface({ users }: Pick<ReturnType<typeof useNexusStore>, 'users'>) {
  const user = users[0]

  return (
    <main className="feature-surface settings-route-surface">
      <section className="feature-card-panel settings-page-panel">
        <aside>
          {['Мой аккаунт', 'Профиль', 'Внешний вид', 'Уведомления', 'Голос и видео', 'Приватность', 'Горячие клавиши', 'О программе'].map((item, index) => (
            <button className={index === 1 ? 'is-active' : ''} key={item} type="button">{item}</button>
          ))}
        </aside>
        <section>
          <h2>Настройки пользователя</h2>
          <div className="settings-profile"><span className="avatar avatar-online">{user.avatar}</span><div><strong>{user.displayName}#4231</strong><button type="button">Изменить аватар</button></div></div>
          <label>Отображаемое имя<input defaultValue={user.displayName} /></label>
          <label>Имя пользователя<input defaultValue={user.username} /></label>
          <label>О себе<textarea defaultValue="Люблю технологии и общение 🚀" /></label>
          <label>Статус<input defaultValue="Онлайн" /></label>
          <button className="modal-primary" type="button">Сохранить изменения</button>
        </section>
      </section>
      <InvitePanel />
    </main>
  )
}

function InvitePanel() {
  return (
    <section className="feature-card-panel invite-panel">
      <h2>Приглашение на сервер</h2>
      <div>
        <p>Пригласить друзей в<br /><strong>Nexus Community</strong></p>
        <label><input readOnly value="https://nexus.gg/abc123" /><button type="button"><Copy size={15} />Копировать</button></label>
        <small>Этот код-приглашение никогда не истечёт.</small>
        <div className="invite-actions">
          <button type="button">Поделиться ссылкой</button>
          <button type="button"><UserPlus size={15} />Пригласить друзей</button>
        </div>
      </div>
    </section>
  )
}

function ArchitecturePanel() {
  const flow = [
    ['Аутентификация', Lock],
    ['Пользователи', Users],
    ['Серверы', Server],
    ['Каналы', GitBranch],
    ['Сообщения', MessageCircle],
    ['Голосовые комнаты', Mic],
  ] as const

  return (
    <section className="architecture-panel">
      <h2>Логика и архитектура Nexus</h2>
      <div className="architecture-flow">
        {flow.map(([label, Icon], index) => (
          <article key={label as string}>
            <span>{index + 1}.</span>
            <strong>{label as string}</strong>
            <Icon size={18} />
          </article>
        ))}
      </div>
      <div className="realtime-layer">WebSocket Real-time Layer</div>
      <div className="tech-stack">
        {[
          ['Frontend', ['Electron', 'React', 'TypeScript', 'Zustand']],
          ['Backend', ['Node.js', 'Express', 'Socket.IO', 'JWT']],
          ['Database', ['Prisma ORM', 'SQLite / PostgreSQL', 'Миграции']],
          ['Realtime', ['Socket.IO', 'Presence', 'Typing']],
        ].map(([title, items]) => (
          <section key={title as string}><h3>{title as string}</h3>{(items as string[]).map((item) => <small key={item}>{item}</small>)}</section>
        ))}
        <Monitor size={18} />
        <Database size={18} />
      </div>
    </section>
  )
}
