import { useEffect, useRef } from 'react'
import {
  Bell,
  BellOff,
  CalendarPlus,
  Check,
  ChevronRight,
  Copy,
  Eye,
  Hash,
  LogOut,
  Megaphone,
  Plus,
  Settings,
  Shield,
  SlidersHorizontal,
  UserCog,
  VolumeX,
} from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import type { Server, User } from '../types'
import { ServerMuteSubmenu } from './ServerMuteSubmenu'
import { ServerNotificationSubmenu } from './ServerNotificationSubmenu'

type Props = Pick<
  NexusStore,
  | 'copyServerId'
  | 'currentUser'
  | 'markServerAsRead'
  | 'muteServer'
  | 'openCreateCategory'
  | 'openCreateChannelModal'
  | 'openCreateEvent'
  | 'openInviteModal'
  | 'openIsolationModal'
  | 'openServerPrivacy'
  | 'openServerProfile'
  | 'openServerSettings'
  | 'setActiveModal'
  | 'serverUsers'
  | 'settings'
  | 'showSoon'
  | 'toggleHideMutedChannels'
  | 'toggleShowAllChannels'
  | 'updateServerNotificationPreference'
> & {
  onClose: () => void
  server: Server
}

function isServerOwner(user: User | null, server: Server) {
  return Boolean(user && server.ownerId === user.id)
}

function canManageServer(user: User | null, server: Server, serverUsers: User[]) {
  if (isServerOwner(user, server)) return true
  const member = serverUsers.find((item) => item.id === user?.id)
  return Boolean(member?.roleIds.some((role) => role === 'owner' || role === 'admin'))
}

function canCreateChannel(user: User | null, server: Server, serverUsers: User[]) {
  return canManageServer(user, server, serverUsers)
}

export function ServerMenuDropdown(props: Props) {
  const {
    copyServerId,
    currentUser,
    markServerAsRead,
    muteServer,
    onClose,
    openCreateCategory,
    openCreateEvent,
    openInviteModal,
    openIsolationModal,
    openServerPrivacy,
    openServerProfile,
    openServerSettings,
    server,
    serverUsers,
    setActiveModal,
    settings,
    showSoon,
    toggleHideMutedChannels,
    toggleShowAllChannels,
    updateServerNotificationPreference,
  } = props
  const ref = useRef<HTMLElement | null>(null)
  const preference = Object.assign(
    { hideMutedChannels: false, mutedUntil: null, notificationPreference: 'all' as const, showAllChannels: true },
    settings.serverPreferences[server.id],
  )
  const owner = isServerOwner(currentUser, server)
  const canManage = canManageServer(currentUser, server, serverUsers)
  const canCreate = canCreateChannel(currentUser, server, serverUsers)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const run = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <section className="server-menu-dropdown" ref={ref}>
      <header>
        <span className="server-menu-icon" style={{ background: server.color }}>{server.icon}</span>
        <div>
          <strong>{server.name}</strong>
          <small>{server.privacy === 'private' ? 'Private server' : 'Public server'}</small>
        </div>
      </header>

      <div className="server-menu-group">
        <button type="button" onClick={() => run(() => markServerAsRead(server.id))}><Check size={17} />Пометить как прочитанное</button>
        <button type="button" onClick={() => run(openInviteModal)}><Megaphone size={17} />Пригласить на сервер</button>
        <div className="server-menu-item has-submenu">
          <button type="button"><VolumeX size={17} />Заглушить сервер <ChevronRight size={15} /></button>
          <ServerMuteSubmenu muteServer={muteServer} serverId={server.id} />
        </div>
        <div className="server-menu-item has-submenu">
          <button type="button"><Bell size={17} />Параметры уведомлений <ChevronRight size={15} /></button>
          <ServerNotificationSubmenu serverId={server.id} updateServerNotificationPreference={updateServerNotificationPreference} value={preference.notificationPreference} />
        </div>
      </div>

      <div className="server-menu-group">
        <button type="button" onClick={() => toggleHideMutedChannels(server.id)}><BellOff size={17} />Скрыть заглушенные каналы <span className={preference.hideMutedChannels ? 'menu-check is-on' : 'menu-check'} /></button>
        <button type="button" onClick={() => toggleShowAllChannels(server.id)}><Eye size={17} />Показать все каналы <span className={preference.showAllChannels ? 'menu-check is-on' : 'menu-check'} /></button>
      </div>

      <div className="server-menu-group">
        <button disabled={!canManage} type="button" onClick={() => canManage ? run(openServerSettings) : showSoon('Недостаточно прав')}><Settings size={17} />Настройки сервера <ChevronRight size={15} /></button>
        <button type="button" onClick={() => run(openServerPrivacy)}><Shield size={17} />Настройки конфиденциальности</button>
        <button type="button" onClick={() => run(openServerProfile)}><UserCog size={17} />Редактировать личный профиль сервера</button>
      </div>

      <div className="server-menu-group">
        <button disabled={!canCreate} type="button" onClick={() => canCreate ? run(() => props.openCreateChannelModal({ category: 'text', defaultType: 'text' })) : showSoon('Недостаточно прав')}><Hash size={17} />Создать канал</button>
        <button disabled={!canCreate} type="button" onClick={() => canCreate ? run(openCreateCategory) : showSoon('Недостаточно прав')}><Plus size={17} />Создать категорию</button>
        <button type="button" onClick={() => run(openCreateEvent)}><CalendarPlus size={17} />Создать событие</button>
      </div>

      <div className="server-menu-group">
        <button className="is-danger" type="button" onClick={() => run(() => owner ? openIsolationModal() : setActiveModal('confirmLeaveServer'))}>
          {owner ? <SlidersHorizontal size={17} /> : <LogOut size={17} />}
          {owner ? 'Изоляция сервера' : 'Покинуть сервер'}
        </button>
        <button type="button" onClick={() => run(() => copyServerId(server.id))}><Copy size={17} />Копировать ID сервера</button>
      </div>
    </section>
  )
}
