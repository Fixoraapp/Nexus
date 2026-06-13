import { useEffect, useMemo, useState } from 'react'
import { events, messages as initialMessages, notifications, roles, servers, users, voiceParticipants as initialVoiceParticipants } from '../data/mockData'
import type { Channel, Message, VoiceParticipant } from '../types'

type ModalName = 'createServer' | 'createChannel' | 'settings' | 'profile' | null

const MESSAGE_STORAGE_KEY = 'nexus.messages.v1'

const loadMessages = () => {
  if (typeof window === 'undefined') {
    return initialMessages
  }

  try {
    const stored = window.localStorage.getItem(MESSAGE_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Message[]) : initialMessages
  } catch {
    return initialMessages
  }
}

export function useNexusStore(initialServerId = 'nexus', initialChannelId = 'nexus-general') {
  const [activeServerId, setActiveServerId] = useState(initialServerId)
  const [activeChannelId, setActiveChannelId] = useState(initialChannelId)
  const [messages, setMessages] = useState<Message[]>(loadMessages)
  const [voiceParticipants, setVoiceParticipants] = useState<VoiceParticipant[]>(initialVoiceParticipants)
  const [membersVisible, setMembersVisible] = useState(true)
  const [activeModal, setActiveModal] = useState<ModalName>(null)
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const [camera, setCamera] = useState(false)
  const [screenSharing, setScreenSharing] = useState(false)
  const [search, setSearch] = useState('')

  const activeServer = useMemo(
    () => servers.find((server) => server.id === activeServerId) ?? servers[0],
    [activeServerId],
  )

  const activeChannel = useMemo<Channel | null>(() => {
    if (activeChannelId === 'home') {
      return null
    }

    return activeServer.channels.find((channel) => channel.id === activeChannelId) ?? null
  }, [activeChannelId, activeServer])

  const channelMessages = useMemo(() => {
    const channelId = activeChannel?.type === 'text' || activeChannel?.type === 'forum' ? activeChannel.id : 'nexus-general'
    const normalizedSearch = search.trim().toLowerCase()
    const list = messages.filter((message) => message.channelId === channelId)
    return normalizedSearch ? list.filter((message) => message.content.toLowerCase().includes(normalizedSearch)) : list
  }, [activeChannel, messages, search])

  const selectServer = (serverId: string) => {
    setActiveServerId(serverId)
    setActiveChannelId(`${serverId}-general`)
  }

  const selectChannel = (channelId: string) => {
    setActiveChannelId(channelId)
  }

  const sendMessage = (content: string) => {
    if (!activeChannel || !content.trim()) {
      return
    }

    const message: Message = {
      id: `local-${Date.now()}`,
      channelId: activeChannel.id,
      authorId: 'u1',
      content: content.trim(),
      timestamp: 'только что',
      reactions: [],
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
        message.id === messageId ? { ...message, content: nextContent, edited: true } : message,
      ),
    )
  }

  const deleteMessage = (messageId: string) => {
    setMessages((current) => current.filter((message) => message.id !== messageId))
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

  const toggleVoiceFlag = (key: 'muted' | 'deafened' | 'camera' | 'screenSharing') => {
    setVoiceParticipants((current) =>
      current.map((participant) =>
        participant.userId === 'u1' ? { ...participant, [key]: !participant[key] } : participant,
      ),
    )
  }

  useEffect(() => {
    window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  return {
    activeChannel,
    activeChannelId,
    activeModal,
    activeServer,
    activeServerId,
    addReaction,
    camera,
    channelMessages,
    deafened,
    deleteMessage,
    editMessage,
    events,
    membersVisible,
    messages,
    muted,
    notifications,
    roles,
    screenSharing,
    search,
    selectChannel,
    selectServer,
    sendMessage,
    servers,
    setActiveModal,
    setCamera,
    setDeafened,
    setMembersVisible,
    setMuted,
    setScreenSharing,
    setSearch,
    toggleVoiceFlag,
    users,
    voiceParticipants,
  }
}

export type NexusStore = ReturnType<typeof useNexusStore>
