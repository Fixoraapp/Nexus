import { useEffect, useMemo, useState } from 'react'
import {
  events as demoEvents,
  messages as demoMessages,
  notifications as demoNotifications,
  roles,
  servers as demoServers,
  users as demoUsers,
  voiceParticipants as demoVoiceParticipants,
} from '../data/mockData'
import { authService } from '../services/authService'
import { activityService } from '../services/activityService'
import { soundService } from '../services/soundService'
import { webrtcService } from '../services/webrtcService'
import type { NexusActivity } from '../services/activityService'
import type { Channel, ChannelCategory, ChannelType, Message, NexusNotification, Server, User, VoiceParticipant } from '../types'

type ModalName =
  | 'activity'
  | 'addServer'
  | 'confirmLeaveServer'
  | 'createCategory'
  | 'createChannel'
  | 'createEvent'
  | 'inviteServer'
  | 'isolation'
  | 'joinServer'
  | 'profile'
  | 'serverPrivacy'
  | 'serverProfile'
  | 'serverSettings'
  | 'settings'
  | null
type ServerMember = { roleId: string; serverId: string; userId: string }
type FriendRequest = { fromUserId: string; id: string; status: 'pending' | 'accepted' | 'declined'; toUserId: string }
type Friendship = { id: string; userIds: [string, string] }
type DirectMessage = { authorId: string; content: string; id: string; timestamp: string }
type DirectChat = { id: string; messages: DirectMessage[]; participantIds: string[] }
type Invite = { code: string; createdAt: string; serverId: string }
type ServerPreference = {
  hideMutedChannels: boolean
  mutedUntil: string | null
  notificationPreference: 'all' | 'mentions' | 'none'
  showAllChannels: boolean
}
type ServerCategory = { id: string; name: string; serverId: string }
type ServerEvent = { channelId: string; dateTime: string; description: string; id: string; serverId: string; title: string }
type ServerProfile = { avatar?: string; nickname: string; serverId: string; userId: string }
type CreateChannelContext = { category: ChannelCategory; categoryId?: string; defaultType: ChannelType } | null
type ChannelPermissionMode = 'onlyMe' | 'members' | 'roles'
type LocalSettings = {
  activeDmId?: string
  onboardingComplete: boolean
  serverPreferences: Record<string, ServerPreference>
}

export type CreateServerInput = {
  color: string
  description: string
  icon: string
  name: string
  privacy: 'public' | 'private'
  template?: string
}

export type CreateChannelInput = {
  category: ChannelCategory
  categoryId?: string
  isPrivate: boolean
  name: string
  permissions?: {
    mode: ChannelPermissionMode
    roleIds: string[]
    userIds: string[]
  }
  serverId?: string
  type: ChannelType
}

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const storageKeys = {
  channels: 'nexus.channels',
  currentUser: 'nexus.currentUser',
  directChats: 'nexus.directChats',
  friendRequests: 'nexus.friendRequests',
  friendships: 'nexus.friendships',
  invites: 'nexus.invites',
  messages: 'nexus.messages',
  serverCategories: 'nexus.serverCategories',
  serverEvents: 'nexus.serverEvents',
  serverMembers: 'nexus.serverMembers',
  serverProfiles: 'nexus.serverProfiles',
  servers: 'nexus.servers',
  settings: 'nexus.settings',
  users: 'nexus.users',
  voiceParticipants: 'nexus.voiceParticipants',
} as const

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback

  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function createId(prefix: string) {
  const bytes = crypto.getRandomValues(new Uint32Array(2))
  return `${prefix}-${Date.now().toString(36)}-${Array.from(bytes).map((item) => item.toString(36)).join('')}`
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё._-]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'new-channel'
}

function formatTime() {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function userFromAuth(): User | null {
  const session = authService.getCurrentUser()
  if (!session) return null

  return {
    activity: 'В сети',
    avatar: session.currentUser.avatar || session.currentUser.displayName.slice(0, 2).toUpperCase(),
    displayName: session.currentUser.displayName,
    email: session.currentUser.email,
    id: session.currentUser.id,
    roleIds: ['member'],
    status: session.currentUser.status,
    username: session.currentUser.username,
  }
}

function normalizeUser(user: Partial<User> & { id: string }): User {
  const displayName = user.displayName || user.username || 'Nexus User'

  return {
    activity: user.activity || 'В сети',
    avatar: user.avatar || displayName.slice(0, 2).toUpperCase(),
    displayName,
    email: user.email || '',
    id: user.id,
    roleIds: user.roleIds?.length ? user.roleIds : ['member'],
    status: user.status || 'online',
    username: user.username || displayName.toLowerCase().replace(/\s+/g, '-'),
  }
}

function uniqueUsers(users: User[]) {
  return Array.from(new Map(users.map((user) => [user.id, user])).values())
}

function createDefaultChannels(serverId: string): Channel[] {
  return [
    {
      category: 'information',
      description: 'Добро пожаловать и важная информация для участников.',
      id: `${serverId}-welcome`,
      isPrivate: false,
      name: 'welcome',
      serverId,
      type: 'text',
    },
    {
      category: 'information',
      description: 'Новости и важные объявления сервера.',
      id: `${serverId}-announcements`,
      isPrivate: false,
      name: 'announcements',
      serverId,
      type: 'text',
    },
    {
      category: 'information',
      description: 'Правила сообщества.',
      id: `${serverId}-rules`,
      isPrivate: false,
      name: 'rules',
      serverId,
      type: 'text',
    },
    {
      category: 'text',
      description: 'Общий чат сообщества.',
      id: `${serverId}-general`,
      isPrivate: false,
      name: 'general',
      serverId,
      type: 'text',
    },
    {
      category: 'voice',
      description: 'Голосовая комната сообщества.',
      id: `${serverId}-lounge`,
      isPrivate: false,
      name: 'Lounge',
      serverId,
      type: 'voice',
    },
  ]
}

function demoMembers() {
  return demoServers.flatMap((server) =>
    demoUsers.map((user, index) => ({
      roleId: index === 0 ? 'owner' : user.roleIds[0] ?? 'member',
      serverId: server.id,
      userId: user.id,
    })),
  )
}

function parseInviteCode(value: string) {
  return value.trim().split('/').filter(Boolean).at(-1)?.replace(/^#/, '').trim() ?? ''
}

const emptySettings: LocalSettings = { onboardingComplete: false, serverPreferences: {} }

function defaultServerPreference(): ServerPreference {
  return {
    hideMutedChannels: false,
    mutedUntil: null,
    notificationPreference: 'all',
    showAllChannels: true,
  }
}

export function useNexusStore(initialServerId = '', initialChannelId = '') {
  const authUser = userFromAuth()
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = readStorage<Array<Partial<User> & { id: string }>>(storageKeys.users, [])
    const baseUsers = DEMO_MODE ? demoUsers : storedUsers.map(normalizeUser)
    return authUser ? uniqueUsers([authUser, ...baseUsers]) : baseUsers
  })
  const [channels, setChannels] = useState<Channel[]>(() => readStorage<Channel[]>(storageKeys.channels, DEMO_MODE ? demoServers.flatMap((server) => server.channels) : []))
  const [servers, setServers] = useState<Server[]>(() => {
    const storedServers = readStorage<Server[]>(storageKeys.servers, DEMO_MODE ? demoServers : [])
    const storedChannels = readStorage<Channel[]>(storageKeys.channels, DEMO_MODE ? demoServers.flatMap((server) => server.channels) : [])
    return storedServers.map((server) => ({ ...server, channels: storedChannels.filter((channel) => channel.serverId === server.id) }))
  })
  const [serverMembers, setServerMembers] = useState<ServerMember[]>(() => readStorage<ServerMember[]>(storageKeys.serverMembers, DEMO_MODE ? demoMembers() : []))
  const [messages, setMessages] = useState<Message[]>(() => readStorage<Message[]>(storageKeys.messages, DEMO_MODE ? demoMessages : []))
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>(() => readStorage<VoiceParticipant[]>(storageKeys.voiceParticipants, DEMO_MODE ? demoVoiceParticipants : []))
  const [serverCategories, setServerCategories] = useState<ServerCategory[]>(() => readStorage<ServerCategory[]>(storageKeys.serverCategories, []))
  const [serverEvents, setServerEvents] = useState<ServerEvent[]>(() => readStorage<ServerEvent[]>(storageKeys.serverEvents, []))
  const [serverProfiles, setServerProfiles] = useState<ServerProfile[]>(() => readStorage<ServerProfile[]>(storageKeys.serverProfiles, []))
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => readStorage<FriendRequest[]>(storageKeys.friendRequests, []))
  const [friendships, setFriendships] = useState<Friendship[]>(() => readStorage<Friendship[]>(storageKeys.friendships, []))
  const [directChats, setDirectChats] = useState<DirectChat[]>(() => readStorage<DirectChat[]>(storageKeys.directChats, []))
  const [invites, setInvites] = useState<Invite[]>(() => readStorage<Invite[]>(storageKeys.invites, []))
  const [settings, setSettings] = useState<LocalSettings>(() => ({ ...emptySettings, ...readStorage<Partial<LocalSettings>>(storageKeys.settings, emptySettings) }))
  const [activeServerId, setActiveServerId] = useState(() => initialServerId || servers[0]?.id || '')
  const [activeChannelId, setActiveChannelId] = useState(() => initialChannelId || channels.find((channel) => channel.serverId === activeServerId && channel.type !== 'voice')?.id || 'home')
  const [membersVisible, setMembersVisible] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalName>(null)
  const [createChannelContext, setCreateChannelContext] = useState<CreateChannelContext>(null)
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [camera, setCamera] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [currentActivity, setCurrentActivity] = useState<NexusActivity | null>(() => activityService.getCurrentActivity())
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  const currentUser = authUser ? users.find((user) => user.id === authUser.id) ?? authUser : users[0] ?? null

  const activeServer = useMemo(() => {
    if (!activeServerId) return null
    const server = servers.find((item) => item.id === activeServerId) ?? null
    return server ? { ...server, channels: channels.filter((channel) => channel.serverId === server.id) } : null
  }, [activeServerId, channels, servers])

  const activeChannel = useMemo<Channel | null>(() => {
    if (!activeServer || activeChannelId === 'home') return null
    return activeServer.channels.find((channel) => channel.id === activeChannelId) ?? activeServer.channels[0] ?? null
  }, [activeChannelId, activeServer])

  const serverUsers = useMemo(() => {
    if (!activeServer) return currentUser ? [currentUser] : []
    return serverMembers
      .filter((member) => member.serverId === activeServer.id)
      .map((member) => {
        const user = users.find((item) => item.id === member.userId)
        return user ? { ...user, roleIds: [member.roleId] } : null
      })
      .filter((user): user is User => Boolean(user))
  }, [activeServer, currentUser, serverMembers, users])

  const channelMessages = useMemo(() => {
    if (!activeChannel || activeChannel.type === 'voice') return []
    const normalizedSearch = search.trim().toLowerCase()
    const list = messages.filter((message) => message.channelId === activeChannel.id)
    return normalizedSearch ? list.filter((message) => message.content.toLowerCase().includes(normalizedSearch)) : list
  }, [activeChannel, messages, search])

  const notifications = useMemo<NexusNotification[]>(() => (DEMO_MODE ? demoNotifications : []), [])
  const friends = useMemo(() => friendships
    .filter((friendship) => currentUser && friendship.userIds.includes(currentUser.id))
    .map((friendship) => users.find((user) => currentUser && friendship.userIds.includes(user.id) && user.id !== currentUser.id))
    .filter((user): user is User => Boolean(user)), [currentUser, friendships, users])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const showSoon = (message = 'Скоро будет доступно') => showToast(message)
  const openAddServerModal = () => setActiveModal('addServer')
  const closeAddServerModal = () => setActiveModal(null)
  const openCreateChannelModal = (context?: Partial<NonNullable<CreateChannelContext>>) => {
    setCreateChannelContext({
      category: context?.category ?? 'text',
      categoryId: context?.categoryId,
      defaultType: context?.defaultType ?? (context?.category === 'voice' ? 'voice' : 'text'),
    })
    setActiveModal('createChannel')
  }

  const selectServer = (serverId: string) => {
    const serverChannels = channels.filter((channel) => channel.serverId === serverId)
    setActiveServerId(serverId)
    setActiveChannelId(serverChannels.find((channel) => channel.type === 'text')?.id ?? serverChannels[0]?.id ?? 'home')
  }

  const selectChannel = (channelId: string) => {
    setActiveChannelId(channelId)
  }

  const getChannelsByServer = (serverId: string) => channels.filter((channel) => channel.serverId === serverId)

  const createServer = (input: CreateServerInput) => {
    if (!currentUser || !input.name.trim()) return

    const serverId = createId('server')
    const baseChannels = createDefaultChannels(serverId)
    const server: Server = {
      channels: baseChannels,
      color: input.color,
      description: input.description.trim() || `Сервер Nexus: ${input.template ?? 'свое пространство'}`,
      icon: input.icon.trim() || input.name.trim()[0]?.toUpperCase() || 'N',
      id: serverId,
      memberCount: 1,
      name: input.name.trim(),
      onlineCount: 1,
      ownerId: currentUser.id,
      privacy: input.privacy,
    }
    const welcomeMessage: Message = {
      authorId: currentUser.id,
      channelId: baseChannels[0].id,
      content: 'Сервер создан. Добро пожаловать в новое сообщество Nexus.',
      id: createId('message'),
      reactions: [],
      timestamp: 'только что',
    }

    setServers((current) => [...current, server])
    setChannels((current) => [...current, ...baseChannels])
    setServerMembers((current) => [...current, { roleId: 'owner', serverId, userId: currentUser.id }])
    setMessages((current) => [...current, welcomeMessage])
    setActiveServerId(serverId)
    setActiveChannelId(baseChannels.find((channel) => channel.name === 'general')?.id ?? baseChannels[0].id)
    setSettings((current) => ({ ...current, onboardingComplete: true }))
    setActiveModal(null)
    showToast('Сервер успешно создан')
  }

  const createChannelLegacy = (input: { category: ChannelCategory; isPrivate: boolean; name: string; type: ChannelType }) => {
    if (!activeServer || !input.name.trim()) return

    const channel: Channel = {
      category: input.category,
      description: input.type === 'voice' ? 'Голосовой канал' : 'Канал сообщества',
      id: createId('channel'),
      isPrivate: input.isPrivate,
      name: slugify(input.name),
      serverId: activeServer.id,
      type: input.type,
    }

    setChannels((current) => [...current, channel])
    if (channel.type !== 'voice' && currentUser) {
      setMessages((current) => [...current, {
        authorId: currentUser.id,
        channelId: channel.id,
        content: 'Канал создан',
        id: createId('message'),
        reactions: [],
        timestamp: 'только что',
      }])
    }
    setActiveChannelId(channel.id)
    setActiveModal(null)
  }

  const createChannel = (input: CreateChannelInput) => {
    const targetServer = servers.find((server) => server.id === (input.serverId ?? activeServer?.id))
    const channelName = slugify(input.name)
    if (!targetServer || !channelName) return null

    const duplicate = channels.some((channel) =>
      channel.serverId === targetServer.id
      && channel.category === input.category
      && (channel.categoryId ?? '') === (input.categoryId ?? '')
      && channel.name.toLowerCase() === channelName.toLowerCase(),
    )

    if (duplicate) {
      showToast('Канал с таким названием уже существует')
      return null
    }

    const channel: Channel = {
      category: input.category,
      categoryId: input.categoryId,
      description: input.type === 'voice' ? 'Голосовой канал' : 'Канал сообщества',
      id: createId('channel'),
      isPrivate: input.isPrivate,
      name: channelName,
      permissions: input.permissions,
      position: channels.filter((item) => item.serverId === targetServer.id && item.category === input.category).length,
      serverId: targetServer.id,
      type: input.type,
    }

    setChannels((current) => [...current, channel])
    if (channel.type !== 'voice' && currentUser) {
      setMessages((current) => [...current, {
        authorId: currentUser.id,
        channelId: channel.id,
        content: 'Канал создан',
        id: createId('message'),
        reactions: [],
        timestamp: 'только что',
      }])
    }
    setActiveChannelId(channel.id)
    setActiveModal(null)
    setCreateChannelContext(null)
    showToast('Канал создан')
    return channel
  }
  void createChannelLegacy

  const createInvite = (serverId = activeServer?.id) => {
    if (!serverId) return ''
    const invite: Invite = {
      code: createId('invite').replace('invite-', '').slice(0, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      serverId,
    }

    setInvites((current) => [...current, invite])
    showToast(`Invite создан: ${invite.code}`)
    return invite.code
  }

  const markServerAsRead = (serverId: string) => {
    setChannels((current) => current.map((channel) => channel.serverId === serverId ? { ...channel, unreadCount: 0 } : channel))
    showToast('Сервер помечен как прочитанный')
  }

  const openInviteModal = (serverId = activeServer?.id) => {
    if (serverId && !invites.some((invite) => invite.serverId === serverId)) {
      createInvite(serverId)
    }
    setActiveModal('inviteServer')
  }

  const muteServer = (serverId: string, duration: '15m' | '1h' | '8h' | '24h' | 'forever') => {
    const durationMs = {
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '8h': 8 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      forever: 0,
    }[duration]
    const mutedUntil = duration === 'forever' ? 'forever' : new Date(Date.now() + durationMs).toISOString()

    setSettings((current) => ({
      ...current,
      serverPreferences: {
        ...current.serverPreferences,
        [serverId]: {
          ...defaultServerPreference(),
          ...current.serverPreferences[serverId],
          mutedUntil,
        },
      },
    }))
    showToast('Сервер заглушен')
  }

  const updateServerNotificationPreference = (serverId: string, value: ServerPreference['notificationPreference']) => {
    setSettings((current) => ({
      ...current,
      serverPreferences: {
        ...current.serverPreferences,
        [serverId]: {
          ...defaultServerPreference(),
          ...current.serverPreferences[serverId],
          notificationPreference: value,
        },
      },
    }))
    showToast('Параметры уведомлений сохранены')
  }

  const toggleHideMutedChannels = (serverId: string) => {
    setSettings((current) => {
      const preference = { ...defaultServerPreference(), ...current.serverPreferences[serverId] }
      return {
        ...current,
        serverPreferences: {
          ...current.serverPreferences,
          [serverId]: { ...preference, hideMutedChannels: !preference.hideMutedChannels },
        },
      }
    })
  }

  const toggleShowAllChannels = (serverId: string) => {
    setSettings((current) => {
      const preference = { ...defaultServerPreference(), ...current.serverPreferences[serverId] }
      return {
        ...current,
        serverPreferences: {
          ...current.serverPreferences,
          [serverId]: { ...preference, showAllChannels: !preference.showAllChannels },
        },
      }
    })
  }

  const openServerSettings = () => setActiveModal('serverSettings')
  const openServerPrivacy = () => setActiveModal('serverPrivacy')
  const openServerProfile = () => setActiveModal('serverProfile')
  const openCreateCategory = () => setActiveModal('createCategory')
  const openCreateEvent = () => setActiveModal('createEvent')
  const openIsolationModal = () => setActiveModal('isolation')

  const updateServer = (serverId: string, data: Partial<Pick<Server, 'color' | 'description' | 'icon' | 'name'>>) => {
    setServers((current) => current.map((server) => server.id === serverId ? { ...server, ...data } : server))
    showToast('Настройки сервера сохранены')
  }

  const updateServerPrivacy = (serverId: string, data: { privacy: 'public' | 'private' }) => {
    setServers((current) => current.map((server) => server.id === serverId ? { ...server, privacy: data.privacy } : server))
    showToast('Конфиденциальность сервера сохранена')
  }

  const updateServerProfile = (serverId: string, data: { avatar?: string; nickname: string }) => {
    if (!currentUser) return
    setServerProfiles((current) => {
      const withoutCurrent = current.filter((profile) => profile.serverId !== serverId || profile.userId !== currentUser.id)
      return [...withoutCurrent, { avatar: data.avatar, nickname: data.nickname.trim(), serverId, userId: currentUser.id }]
    })
    showToast('Профиль сервера сохранен')
  }

  const createCategory = (serverId: string, name: string) => {
    if (!name.trim()) return
    setServerCategories((current) => [...current, { id: createId('category'), name: name.trim(), serverId }])
    setActiveModal(null)
    showToast('Категория создана')
  }

  const createEvent = (serverId: string, data: { channelId: string; dateTime: string; description: string; title: string }) => {
    if (!data.title.trim() || !data.dateTime) return
    setServerEvents((current) => [...current, { ...data, id: createId('event'), serverId, title: data.title.trim() }])
    setActiveModal(null)
    showToast('Событие создано')
  }

  const leaveServer = (serverId: string) => {
    if (!currentUser) return
    setServerMembers((current) => current.filter((member) => member.serverId !== serverId || member.userId !== currentUser.id))
    const nextServer = servers.find((server) => server.id !== serverId)
    setActiveServerId(nextServer?.id ?? '')
    setActiveChannelId(nextServer?.channels.find((channel) => channel.type === 'text')?.id ?? 'home')
    setActiveModal(null)
    showToast('Вы покинули сервер')
  }

  const copyServerId = async (serverId: string) => {
    try {
      await navigator.clipboard.writeText(serverId)
      showToast('ID сервера скопирован')
    } catch {
      showToast(serverId)
    }
  }

  const joinServerByInvite = (code: string) => {
    const parsedCode = parseInviteCode(code)
    const invite = invites.find((item) => item.code.toLowerCase() === parsedCode.toLowerCase())

    if (!invite || !currentUser) {
      showToast('Приглашение не найдено или истекло')
      return false
    }

    setServerMembers((current) => {
      if (current.some((member) => member.serverId === invite.serverId && member.userId === currentUser.id)) return current
      return [...current, { roleId: 'member', serverId: invite.serverId, userId: currentUser.id }]
    })
    selectServer(invite.serverId)
    setActiveModal(null)
    showToast('Вы присоединились к серверу')
    return true
  }

  const sendMessage = (channelIdOrContent: string, content?: string) => {
    const targetChannelId = content === undefined ? activeChannel?.id : channelIdOrContent
    const nextContent = content === undefined ? channelIdOrContent : content
    if (!targetChannelId || !nextContent.trim() || !currentUser) return
    const message: Message = {
      authorId: currentUser.id,
      channelId: targetChannelId,
      content: nextContent.trim(),
      id: createId('message'),
      reactions: [],
      timestamp: formatTime(),
    }
    setMessages((current) => [...current, message])
    soundService.playMessage()
  }

  const editMessage = (messageId: string, content: string) => {
    const nextContent = content.trim()
    if (!nextContent) return
    setMessages((current) => current.map((message) => message.id === messageId && message.authorId === currentUser?.id ? { ...message, content: nextContent, edited: true } : message))
  }

  const deleteMessage = (messageId: string) => {
    setMessages((current) => current.filter((message) => message.id !== messageId || message.authorId !== currentUser?.id))
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((current) => current.map((message) => {
      if (message.id !== messageId) return message
      const existing = message.reactions.find((reaction) => reaction.emoji === emoji)
      return {
        ...message,
        reactions: existing
          ? message.reactions.map((reaction) => reaction.emoji === emoji ? { ...reaction, count: Math.max(0, reaction.count + 1) } : reaction).filter((reaction) => reaction.count > 0)
          : [...message.reactions, { emoji, count: 1 }],
      }
    }))
  }

  const searchUsers = (query: string) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized || !currentUser) return []
    return users.filter((user) => user.id !== currentUser.id && (
      user.displayName.toLowerCase().includes(normalized)
      || user.username.toLowerCase().includes(normalized)
      || user.email.toLowerCase().includes(normalized)
    ))
  }

  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser || targetUserId === currentUser.id) return
    if (friendships.some((friendship) => friendship.userIds.includes(currentUser.id) && friendship.userIds.includes(targetUserId))) return
    setFriendRequests((current) => {
      if (current.some((request) => request.fromUserId === currentUser.id && request.toUserId === targetUserId && request.status === 'pending')) return current
      return [...current, { fromUserId: currentUser.id, id: createId('friend'), status: 'pending', toUserId: targetUserId }]
    })
  }

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find((item) => item.id === requestId)
    if (!request) return
    setFriendRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: 'accepted' } : item))
    setFriendships((current) => [...current, { id: createId('friendship'), userIds: [request.fromUserId, request.toUserId] }])
  }

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: 'declined' } : item))
  }

  const startDirectChat = (userId: string) => {
    if (!currentUser) return ''
    const existing = directChats.find((chat) => chat.participantIds.includes(currentUser.id) && chat.participantIds.includes(userId))
    if (existing) {
      setSettings((current) => ({ ...current, activeDmId: existing.id }))
      return existing.id
    }

    const chat: DirectChat = { id: createId('dm'), messages: [], participantIds: [currentUser.id, userId] }
    setDirectChats((current) => [...current, chat])
    setSettings((current) => ({ ...current, activeDmId: chat.id }))
    return chat.id
  }

  const sendDirectMessage = (chatId: string, content: string) => {
    if (!currentUser || !content.trim()) return
    setDirectChats((current) => current.map((chat) => chat.id === chatId
      ? { ...chat, messages: [...chat.messages, { authorId: currentUser.id, content: content.trim(), id: createId('dm-message'), timestamp: formatTime() }] }
      : chat))
  }

  const joinVoiceChannel = (channelId = activeChannel?.id) => {
    if (!channelId || !currentUser) return
    void webrtcService.joinRoom(channelId).then((result) => {
      if (!result.microphoneAllowed) showToast('Микрофон не разрешен')
    })
    soundService.playVoiceJoin()
    setVoiceParticipants((current) => {
      const withoutUser = current.filter((participant) => participant.userId !== currentUser.id)
      return [...withoutUser, { camera, channelId, deafened, joinedAt: new Date().toISOString(), muted, screenSharing, speaking: false, userId: currentUser.id }]
    })
    showToast('Голосовая связь подключена')
  }

  const leaveVoiceChannel = () => {
    if (!currentUser) return
    webrtcService.leaveRoom()
    soundService.playVoiceLeave()
    setVoiceParticipants((current) => current.filter((participant) => participant.userId !== currentUser.id))
    showToast('Голосовая связь отключена')
  }

  const syncVoiceFlag = (key: 'muted' | 'deafened' | 'camera' | 'screenSharing', value: boolean) => {
    if (!currentUser) return
    setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, [key]: value } : participant))
  }

  const toggleVoiceFlag = (key: 'muted' | 'deafened' | 'camera' | 'screenSharing') => {
    if (!currentUser) return
    setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, [key]: !participant[key] } : participant))
  }

  const setVoiceMuted = (value: boolean) => {
    setMuted(value)
    webrtcService.toggleMute(value)
    soundService.playMute()
    syncVoiceFlag('muted', value)
  }

  const toggleMute = () => setVoiceMuted(!muted)
  const toggleDeafen = () => setVoiceDeafened(!deafened)
  const toggleStreaming = () => setVoiceScreenSharing(!screenSharing)

  const setActivity = (activity: Omit<NexusActivity, 'id' | 'startedAt'> & { id?: string; startedAt?: string }) => {
    setCurrentActivity(activityService.setManualActivity(activity))
  }

  const clearActivity = () => {
    activityService.clearActivity()
    setCurrentActivity(null)
  }

  const updateUserStatus = (status: User['status']) => {
    if (!currentUser) return
    setUsers((current) => current.map((user) => user.id === currentUser.id ? { ...user, status } : user))
    void authService.updateProfile({ status }).catch(() => undefined)
  }

  const openUserProfilePopout = () => setActiveModal('profile')
  const closeUserProfilePopout = () => setActiveModal(null)
  const openSettings = () => setActiveModal('settings')
  const openActivityModal = () => setActiveModal('activity')

  const copyUserId = async () => {
    if (!currentUser) return

    try {
      await navigator.clipboard.writeText(currentUser.id)
      showToast('ID пользователя скопирован')
    } catch {
      showToast(currentUser.id)
    }
  }

  const logout = () => {
    authService.logout()
    activityService.clearActivity()
    setCurrentActivity(null)
    setActiveModal(null)
    window.location.hash = '#/login'
  }

  const setVoiceDeafened = (value: boolean) => {
    setDeafened(value)
    webrtcService.toggleDeafen()
    soundService.playDeafen()
    syncVoiceFlag('deafened', value)
  }

  const setVoiceCamera = (value: boolean) => {
    setCamera(value)
    syncVoiceFlag('camera', value)
  }

  const setVoiceScreenSharing = (value: boolean) => {
    setScreenSharing(value)
    if (value) {
      void webrtcService.startScreenShare()
    } else {
      webrtcService.stopScreenShare()
    }
    syncVoiceFlag('screenSharing', value)
  }

  const toggleCamera = () => setVoiceCamera(!camera)
  const toggleScreenShare = () => setVoiceScreenSharing(!screenSharing)
  const setSpeaking = (userId: string, speaking: boolean) => {
    setVoiceParticipants((current) => current.map((participant) => participant.userId === userId ? { ...participant, speaking } : participant))
  }
  const getVoiceSessions = (channelId: string) => voiceParticipants.filter((participant) => participant.channelId === channelId)

  const updateProfile = async (profile: Partial<User>) => {
    if (!currentUser) return
    setUsers((current) => current.map((user) => user.id === currentUser.id ? { ...user, ...profile } : user))
    await authService.updateProfile({
      avatar: profile.avatar,
      displayName: profile.displayName,
      email: profile.email,
      status: profile.status,
      username: profile.username,
    })
  }

  useEffect(() => {
    if (authUser) writeStorage(storageKeys.currentUser, authUser)
  }, [authUser])

  useEffect(() => activityService.subscribeActivityChanges(setCurrentActivity), [])

  useEffect(() => writeStorage(storageKeys.servers, servers.map((server) => ({
    color: server.color,
    description: server.description,
    icon: server.icon,
    id: server.id,
    memberCount: server.memberCount,
    name: server.name,
    onlineCount: server.onlineCount,
    ownerId: server.ownerId,
    privacy: server.privacy,
  }))), [servers])
  useEffect(() => writeStorage(storageKeys.channels, channels), [channels])
  useEffect(() => writeStorage(storageKeys.messages, messages), [messages])
  useEffect(() => writeStorage(storageKeys.serverCategories, serverCategories), [serverCategories])
  useEffect(() => writeStorage(storageKeys.serverEvents, serverEvents), [serverEvents])
  useEffect(() => writeStorage(storageKeys.serverMembers, serverMembers), [serverMembers])
  useEffect(() => writeStorage(storageKeys.serverProfiles, serverProfiles), [serverProfiles])
  useEffect(() => writeStorage(storageKeys.friendRequests, friendRequests), [friendRequests])
  useEffect(() => writeStorage(storageKeys.friendships, friendships), [friendships])
  useEffect(() => writeStorage(storageKeys.directChats, directChats), [directChats])
  useEffect(() => writeStorage(storageKeys.invites, invites), [invites])
  useEffect(() => writeStorage(storageKeys.settings, settings), [settings])
  useEffect(() => writeStorage(storageKeys.voiceParticipants, voiceParticipants), [voiceParticipants])

  return {
    acceptFriendRequest,
    activeChannel,
    activeChannelId,
    activeModal,
    activeServer,
    activeServerId,
    addReaction,
    camera,
    channelMessages,
    channels,
    closeAddServerModal,
    closeUserProfilePopout,
    copyUserId,
    copyServerId,
    createCategory,
    createChannel,
    createChannelContext,
    createDefaultChannels,
    createEvent,
    createInvite,
    createServer,
    currentUser,
    currentActivity,
    clearActivity,
    deafened,
    declineFriendRequest,
    deleteMessage,
    directChats,
    editMessage,
    events: DEMO_MODE ? demoEvents : [],
    friendRequests,
    friendships,
    friends,
    getChannelsByServer,
    getVoiceSessions,
    invites,
    joinServerByInvite,
    joinVoiceChannel,
    leaveVoiceChannel,
    membersVisible,
    messages,
    muted,
    notifications,
    openAddServerModal,
    openActivityModal,
    openCreateCategory,
    openCreateChannelModal,
    openCreateEvent,
    openInviteModal,
    openIsolationModal,
    openServerPrivacy,
    openServerProfile,
    openServerSettings,
    openSettings,
    openUserProfilePopout,
    roles,
    screenSharing,
    search,
    searchUsers,
    selectChannel,
    selectServer,
    sendDirectMessage,
    sendFriendRequest,
    sendMessage,
    servers,
    serverCategories,
    serverEvents,
    serverMembers,
    serverProfiles,
    serverUsers,
    setActiveModal,
    setActivity,
    setCamera: setVoiceCamera,
    setDeafened: setVoiceDeafened,
    setMembersVisible,
    setMuted: setVoiceMuted,
    setScreenSharing: setVoiceScreenSharing,
    setSearch,
    setSpeaking,
    settings,
    showSoon,
    showToast,
    startDirectChat,
    toast,
    leaveServer,
    markServerAsRead,
    muteServer,
    toggleCamera,
    toggleDeafen,
    toggleHideMutedChannels,
    toggleMute,
    toggleScreenShare,
    toggleShowAllChannels,
    toggleStreaming,
    toggleVoiceFlag,
    logout,
    updateServer,
    updateServerNotificationPreference,
    updateServerPrivacy,
    updateServerProfile,
    updateUserStatus,
    updateProfile,
    users,
    voiceParticipants,
  }
}

export type NexusStore = ReturnType<typeof useNexusStore>
