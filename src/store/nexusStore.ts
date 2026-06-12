import { useMemo, useState } from 'react'
import { events, messages as initialMessages, notifications, roles, servers, users, voiceParticipants as initialVoiceParticipants } from '../data/mockData'
import type { Channel, Message, VoiceParticipant } from '../types'

type ModalName = 'createServer' | 'createChannel' | 'settings' | 'profile' | null

export function useNexusStore(initialServerId = 'nexus', initialChannelId = 'home') {
  const [activeServerId, setActiveServerId] = useState(initialServerId)
  const [activeChannelId, setActiveChannelId] = useState(initialChannelId)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
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
    return messages.filter((message) => message.channelId === channelId)
  }, [activeChannel, messages])

  const selectServer = (serverId: string) => {
    setActiveServerId(serverId)
    setActiveChannelId('home')
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
