export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline'

export type User = {
  id: string
  username: string
  displayName: string
  avatar: string
  status: UserStatus
  activity: string
  roleIds: string[]
  email: string
}

export type ChannelType = 'text' | 'voice' | 'forum' | 'event' | 'announcement' | 'project'

export type ChannelCategory = 'information' | 'text' | 'voice' | 'events' | 'private'

export type Channel = {
  id: string
  serverId: string
  name: string
  type: ChannelType
  category: ChannelCategory
  categoryId?: string
  isPrivate: boolean
  description: string
  permissions?: {
    mode: 'onlyMe' | 'members' | 'roles'
    roleIds: string[]
    userIds: string[]
  }
  position?: number
  unreadCount?: number
}

export type Server = {
  id: string
  name: string
  icon: string
  description: string
  memberCount: number
  onlineCount: number
  ownerId: string
  channels: Channel[]
  color?: string
  privacy?: 'public' | 'private'
}

export type Reaction = {
  emoji: string
  count: number
}

export type Message = {
  id: string
  channelId: string
  authorId: string
  content: string
  timestamp: string
  reactions: Reaction[]
  replyTo?: string
  edited?: boolean
}

export type Role = {
  id: string
  name: string
  color: string
  priority: number
  permissions: string[]
}

export type NexusNotification = {
  id: string
  title: string
  body: string
  read: boolean
  type: 'message' | 'mention' | 'event' | 'system'
}

export type VoiceParticipant = {
  userId: string
  channelId?: string
  joinedAt?: string
  speaking: boolean
  muted: boolean
  deafened: boolean
  camera: boolean
  screenSharing: boolean
}

export type NexusEvent = {
  id: string
  title: string
  date: string
  serverId: string
  channelId: string
}
