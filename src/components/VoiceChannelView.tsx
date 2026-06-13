import { Bell, Pin, Search, Settings, Users, Volume2 } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { VoiceControls } from './VoiceControls'
import { VoiceParticipantCard } from './VoiceParticipantCard'

type Props = Pick<
  NexusStore,
  | 'activeChannel'
  | 'camera'
  | 'currentActivity'
  | 'currentUser'
  | 'deafened'
  | 'getVoiceSessions'
  | 'joinVoiceChannel'
  | 'leaveVoiceChannel'
  | 'membersVisible'
  | 'muted'
  | 'screenSharing'
  | 'serverUsers'
  | 'setActiveModal'
  | 'setMembersVisible'
  | 'toggleCamera'
  | 'toggleDeafen'
  | 'toggleMute'
  | 'toggleScreenShare'
>

export function VoiceChannelView(props: Props) {
  const {
    activeChannel,
    camera,
    currentActivity,
    currentUser,
    deafened,
    getVoiceSessions,
    joinVoiceChannel,
    leaveVoiceChannel,
    membersVisible,
    muted,
    screenSharing,
    serverUsers,
    setActiveModal,
    setMembersVisible,
    toggleCamera,
    toggleDeafen,
    toggleMute,
    toggleScreenShare,
  } = props

  if (!activeChannel) return null

  const sessions = getVoiceSessions(activeChannel.id)
  const participants = sessions
    .map((session) => {
      const user = serverUsers.find((item) => item.id === session.userId)
      return user ? { session, user } : null
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  const isJoined = Boolean(currentUser && sessions.some((session) => session.userId === currentUser.id))

  return (
    <main className="voice-channel-view">
      <header className="channel-view-header">
        <div className="channel-view-title">
          <Volume2 size={24} />
          <div>
            <h1>{activeChannel.name}</h1>
            <p>Голосовая комната сообщества</p>
          </div>
        </div>
        <div className="channel-view-tools">
          <button className="icon-button" type="button" title="Поиск"><Search size={18} /></button>
          <button className="icon-button" type="button" title="Закрепленные"><Pin size={18} /></button>
          <button className="icon-button" type="button" title="Уведомления"><Bell size={18} /></button>
          <button className={`icon-button ${membersVisible ? 'is-on' : ''}`} type="button" onClick={() => setMembersVisible(!membersVisible)} title="Участники"><Users size={18} /></button>
          <button className="icon-button" type="button" onClick={() => setActiveModal('settings')} title="Настройки"><Settings size={18} /></button>
        </div>
      </header>

      <section className="voice-stage">
        {!isJoined ? (
          <section className="voice-join-panel">
            <span><Volume2 size={42} /></span>
            <h2>{activeChannel.name}</h2>
            <p>Сейчас в голосовом канале никого нет</p>
            <button type="button" onClick={() => joinVoiceChannel(activeChannel.id)}>Присоединиться к голосовому каналу</button>
          </section>
        ) : (
          <section className={`voice-participants-grid count-${Math.min(participants.length, 4)}`}>
            {participants.map(({ session, user }) => (
              <VoiceParticipantCard
                activity={user.id === currentUser?.id ? currentActivity : null}
                key={user.id}
                participant={user.id === currentUser?.id ? { ...session, speaking: !muted } : session}
                user={user}
              />
            ))}
          </section>
        )}
      </section>

      {isJoined ? (
        <VoiceControls
          camera={camera}
          deafened={deafened}
          leaveVoiceChannel={leaveVoiceChannel}
          muted={muted}
          screenSharing={screenSharing}
          toggleCamera={toggleCamera}
          toggleDeafen={toggleDeafen}
          toggleMute={toggleMute}
          toggleScreenShare={toggleScreenShare}
        />
      ) : null}
    </main>
  )
}
