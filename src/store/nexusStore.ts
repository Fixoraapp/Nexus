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
import type { Channel, ChannelCategory, ChannelType, Message, NexusNotification, Server, User, VoiceParticipant } from '../types'

type ModalName = 'createServer' | 'createChannel' | 'settings' | 'profile' | 'joinServer' | null
type ServerMember = { roleId: string; serverId: string; userId: string }
type FriendRequest = { fromUserId: string; id: string; status: 'pending' | 'accepted' | 'declined'; toUserId: string }
type Friendship = { id: string; userIds: [string, string] }
type DirectMessage = { authorId: string; content: string; id: string; timestamp: string }
type DirectChat = { id: string; messages: DirectMessage[]; participantIds: string[] }
type Invite = { code: string; createdAt: string; serverId: string }
type LocalSettings = { activeDmId?: string; onboardingComplete: boolean }

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

const storageKeys = {
  channels: 'nexus.channels',
  currentUser: 'nexus.currentUser',
  directChats: 'nexus.directChats',
  friendRequests: 'nexus.friendRequests',
  friendships: 'nexus.friendships',
  invites: 'nexus.invites',
  messages: 'nexus.messages',
  serverMembers: 'nexus.serverMembers',
  servers: 'nexus.servers',
  settings: 'nexus.settings',
  users: 'nexus.users',
} as const

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback
  }

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

  if (!session) {
    return null
  }

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

function uniqueUsers(users: User[]) {
  return Array.from(new Map(users.map((user) => [user.id, user])).values())
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

function createBaseChannels(serverId: string): Channel[] {
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

const emptySettings: LocalSettings = { onboardingComplete: false }

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
    return storedServers.map((server) => ({
      ...server,
      channels: storedChannels.filter((channel) => channel.serverId === server.id),
    }))
  })
  const [serverMembers, setServerMembers] = useState<ServerMember[]>(() => readStorage<ServerMember[]>(storageKeys.serverMembers, DEMO_MODE ? demoMembers() : []))
  const [messages, setMessages] = useState<Message[]>(() => readStorage<Message[]>(storageKeys.messages, DEMO_MODE ? demoMessages : []))
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>(() => readStorage<VoiceParticipant[]>('nexus.voiceParticipants', DEMO_MODE ? demoVoiceParticipants : []))
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => readStorage<FriendRequest[]>(storageKeys.friendRequests, []))
  const [friendships, setFriendships] = useState<Friendship[]>(() => readStorage<Friendship[]>(storageKeys.friendships, []))
  const [directChats, setDirectChats] = useState<DirectChat[]>(() => readStorage<DirectChat[]>(storageKeys.directChats, []))
  const [invites, setInvites] = useState<Invite[]>(() => readStorage<Invite[]>(storageKeys.invites, []))
  const [settings, setSettings] = useState<LocalSettings>(() => readStorage<LocalSettings>(storageKeys.settings, emptySettings))
  const [activeServerId, setActiveServerId] = useState(() => initialServerId || servers[0]?.id || '')
  const [activeChannelId, setActiveChannelId] = useState(() => initialChannelId || channels.find((channel) => channel.serverId === activeServerId && channel.type !== 'voice')?.id || 'home')
  const [membersVisible, setMembersVisible] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalName>(null)
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [camera, setCamera] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')

  const currentUser = authUser ?? users[0] ?? null

  const activeServer = useMemo(() => {
    if (!activeServerId) {
      return null
    }

    const server = servers.find((item) => item.id === activeServerId) ?? servers[0] ?? null

    if (!server) {
      return null
    }

    return {
      ...server,
      channels: channels.filter((channel) => channel.serverId === server.id),
    }
  }, [activeServerId, channels, servers])

  const activeChannel = useMemo<Channel | null>(() => {
    if (!activeServer || activeChannelId === 'home') {
      return null
    }

    return activeServer.channels.find((channel) => channel.id === activeChannelId) ?? activeServer.channels[0] ?? null
  }, [activeChannelId, activeServer])

  const serverUsers = useMemo(() => {
    if (!activeServer) {
      return currentUser ? [currentUser] : []
    }

    const members = serverMembers.filter((member) => member.serverId === activeServer.id)
    return members
      .map((member) => {
        const user = users.find((item) => item.id === member.userId)
        return user ? { ...user, roleIds: [member.roleId] } : null
      })
      .filter((user): user is User => Boolean(user))
  }, [activeServer, currentUser, serverMembers, users])

  const channelMessages = useMemo(() => {
    if (!activeChannel || !['text', 'forum'].includes(activeChannel.type)) {
      return []
    }

    const normalizedSearch = search.trim().toLowerCase()
    const list = messages.filter((message) => message.channelId === activeChannel.id)
    return normalizedSearch ? list.filter((message) => message.content.toLowerCase().includes(normalizedSearch)) : list
  }, [activeChannel, messages, search])

  const notifications = useMemo<NexusNotification[]>(() => (DEMO_MODE ? demoNotifications : []), [])
  const friends = useMemo(() => friendships
    .filter((friendship) => currentUser && friendship.userIds.includes(currentUser.id))
    .map((friendship) => users.find((user) => currentUser && friendship.userIds.includes(user.id) && user.id !== currentUser.id))
    .filter((user): user is User => Boolean(user)), [currentUser, friendships, users])

  const selectServer = (serverId: string) => {
    const serverChannels = channels.filter((channel) => channel.serverId === serverId)
    setActiveServerId(serverId)
    setActiveChannelId(serverChannels.find((channel) => channel.type === 'text')?.id ?? serverChannels[0]?.id ?? 'home')
  }

  const selectChannel = (channelId: string) => {
    setActiveChannelId(channelId)
  }

  const showSoon = (message = 'Скоро будет доступно') => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const createServer = (input: { color: string; description: string; icon: string; name: string; privacy: 'public' | 'private' }) => {
    if (!currentUser || !input.name.trim()) {
      return
    }

    const serverId = createId('server')
    const baseChannels = createBaseChannels(serverId)
    const server: Server = {
      channels: baseChannels,
      color: input.color,
      description: input.description.trim(),
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
    setActiveChannelId(baseChannels[1].id)
    setSettings((current) => ({ ...current, onboardingComplete: true }))
    setActiveModal(null)
  }

  const createChannel = (input: { category: ChannelCategory; isPrivate: boolean; name: string; type: ChannelType }) => {
    if (!activeServer || !input.name.trim()) {
      return
    }

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
      setMessages((current) => [
        ...current,
        {
          authorId: currentUser.id,
          channelId: channel.id,
          content: 'Канал создан',
          id: createId('message'),
          reactions: [],
          timestamp: 'только что',
        },
      ])
    }
    setActiveChannelId(channel.id)
    setActiveModal(null)
  }

  const createInvite = (serverId = activeServer?.id) => {
    if (!serverId) {
      return ''
    }

    const invite: Invite = {
      code: createId('invite').replace('invite-', '').slice(0, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      serverId,
    }

    setInvites((current) => [...current, invite])
    return invite.code
  }

  const joinServerByInvite = (code: string) => {
    const invite = invites.find((item) => item.code.toLowerCase() === code.trim().toLowerCase())

    if (!invite || !currentUser) {
      showSoon('Invite-код не найден')
      return false
    }

    setServerMembers((current) => {
      if (current.some((member) => member.serverId === invite.serverId && member.userId === currentUser.id)) {
        return current
      }

      return [...current, { roleId: 'member', serverId: invite.serverId, userId: currentUser.id }]
    })
    selectServer(invite.serverId)
    setActiveModal(null)
    return true
  }

  const sendMessage = (content: string) => {
    if (!activeChannel || !content.trim() || !currentUser) {
      return
    }

    const message: Message = {
      authorId: currentUser.id,
      channelId: activeChannel.id,
      content: content.trim(),
      id: createId('message'),
      reactions: [],
      timestamp: formatTime(),
    }

    setMessages((current) => [...current, message])
  }

  const editMessage = (messageId: string, content: string) => {
    const nextContent = content.trim()
    if (!nextContent) {
      return
    }

    setMessages((current) =>
      current.map((message) =>
        message.id === messageId && message.authorId === currentUser?.id ? { ...message, content: nextContent, edited: true } : message,
      ),
    )
  }

  const deleteMessage = (messageId: string) => {
    setMessages((current) => current.filter((message) => message.id !== messageId || message.authorId !== currentUser?.id))
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== messageId) {
          return message
        }

        const existing = message.reactions.find((reaction) => reaction.emoji === emoji)
        return {
          ...message,
          reactions: existing
            ? message.reactions.map((reaction) =>
                reaction.emoji === emoji ? { ...reaction, count: reaction.count + 1 } : reaction,
              )
            : [...message.reactions, { emoji, count: 1 }],
        }
      }),
    )
  }

  const searchUsers = (query: string) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized || !currentUser) {
      return []
    }

    return users.filter((user) => user.id !== currentUser.id && (user.username.includes(normalized) || user.email.toLowerCase().includes(normalized)))
  }

  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser || targetUserId === currentUser.id) {
      return
    }

    setFriendRequests((current) => {
      if (current.some((request) => request.fromUserId === currentUser.id && request.toUserId === targetUserId && request.status === 'pending')) {
        return current
      }

      return [...current, { fromUserId: currentUser.id, id: createId('friend'), status: 'pending', toUserId: targetUserId }]
    })
  }

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find((item) => item.id === requestId)
    if (!request) {
      return
    }

    setFriendRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: 'accepted' } : item))
    setFriendships((current) => [...current, { id: createId('friendship'), userIds: [request.fromUserId, request.toUserId] }])
  }

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: 'declined' } : item))
  }

  const startDirectChat = (userId: string) => {
    if (!currentUser) {
      return ''
    }

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
    if (!currentUser || !content.trim()) {
      return
    }

    setDirectChats((current) => current.map((chat) => chat.id === chatId
      ? { ...chat, messages: [...chat.messages, { authorId: currentUser.id, content: content.trim(), id: createId('dm-message'), timestamp: formatTime() }] }
      : chat))
  }

  const joinVoiceChannel = (channelId = activeChannel?.id) => {
    if (!channelId || !currentUser) {
      return
    }

    setVoiceParticipants((current) => {
      const withoutUser = current.filter((participant) => participant.userId !== currentUser.id)
      return [...withoutUser, { camera, deafened, muted, screenSharing, speaking: true, userId: currentUser.id }]
    })
  }

  const leaveVoiceChannel = () => {
    if (!currentUser) {
      return
    }

    setVoiceParticipants((current) => current.filter((participant) => participant.userId !== currentUser.id))
  }

  const toggleVoiceFlag = (key: 'muted' | 'deafened' | 'camera' | 'screenSharing') => {
    if (!currentUser) {
      return
    }

    setVoiceParticipants((current) =>
      current.map((participant) =>
        participant.userId === currentUser.id ? { ...participant, [key]: !participant[key] } : participant,
      ),
    )
  }

  const setVoiceMuted = (value: boolean) => {
    setMuted(value)
    if (currentUser) {
      setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, muted: value } : participant))
    }
  }

  const setVoiceDeafened = (value: boolean) => {
    setDeafened(value)
    if (currentUser) {
      setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, deafened: value } : participant))
    }
  }

  const setVoiceCamera = (value: boolean) => {
    setCamera(value)
    if (currentUser) {
      setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, camera: value } : participant))
    }
  }

  const setVoiceScreenSharing = (value: boolean) => {
    setScreenSharing(value)
    if (currentUser) {
      setVoiceParticipants((current) => current.map((participant) => participant.userId === currentUser.id ? { ...participant, screenSharing: value } : participant))
    }
  }

  const updateProfile = (profile: Partial<User>) => {
    if (!currentUser) {
      return
    }

    setUsers((current) => current.map((user) => user.id === currentUser.id ? { ...user, ...profile } : user))
    authService.updateProfile({
      avatar: profile.avatar,
      displayName: profile.displayName,
      email: profile.email,
      status: profile.status,
      username: profile.username,
    })
  }

  useEffect(() => {
    if (authUser) {
      writeStorage(storageKeys.currentUser, authUser)
    }
  }, [authUser])

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
  useEffect(() => writeStorage(storageKeys.serverMembers, serverMembers), [serverMembers])
  useEffect(() => writeStorage(storageKeys.friendRequests, friendRequests), [friendRequests])
  useEffect(() => writeStorage(storageKeys.friendships, friendships), [friendships])
  useEffect(() => writeStorage(storageKeys.directChats, directChats), [directChats])
  useEffect(() => writeStorage(storageKeys.invites, invites), [invites])
  useEffect(() => writeStorage(storageKeys.settings, settings), [settings])
  useEffect(() => writeStorage('nexus.voiceParticipants', voiceParticipants), [voiceParticipants])

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
    createChannel,
    createInvite,
    createServer,
    currentUser,
    deafened,
    declineFriendRequest,
    deleteMessage,
    directChats,
    editMessage,
    events: DEMO_MODE ? demoEvents : [],
    friendRequests,
    friendships,
    friends,
    invites,
    joinServerByInvite,
    joinVoiceChannel,
    leaveVoiceChannel,
    membersVisible,
    messages,
    muted,
    notifications,
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
    serverMembers,
    serverUsers,
    setActiveModal,
    setCamera: setVoiceCamera,
    setDeafened: setVoiceDeafened,
    setMembersVisible,
    setMuted: setVoiceMuted,
    setScreenSharing: setVoiceScreenSharing,
    setSearch,
    settings,
    showSoon,
    startDirectChat,
    toast,
    toggleVoiceFlag,
    updateProfile,
    users,
    voiceParticipants,
  }
}

export type NexusStore = ReturnType<typeof useNexusStore>
