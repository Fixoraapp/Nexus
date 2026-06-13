import { Mic, MicOff, MonitorUp, Phone, Video, Volume2 } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<
  NexusStore,
  | 'activeChannel'
  | 'camera'
  | 'currentUser'
  | 'deafened'
  | 'joinVoiceChannel'
  | 'leaveVoiceChannel'
  | 'muted'
  | 'screenSharing'
  | 'serverUsers'
  | 'setCamera'
  | 'setDeafened'
  | 'setMuted'
  | 'setScreenSharing'
  | 'voiceParticipants'
>

export function VoiceRoom(props: Props) {
  const { activeChannel, camera, currentUser, deafened, joinVoiceChannel, leaveVoiceChannel, muted, screenSharing, serverUsers, setCamera, setDeafened, setMuted, setScreenSharing, voiceParticipants } = props
  const participants = voiceParticipants
    .map((participant) => {
      const user = serverUsers.find((item) => item.id === participant.userId)
      return user ? { participant, user } : null
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  const isJoined = Boolean(currentUser && voiceParticipants.some((participant) => participant.userId === currentUser.id))

  return (
    <main className="voice-room voice-room-redesign">
      <section className="voice-panel">
        <header>
          <div>
            <strong>{activeChannel?.name ?? 'Voice'}</strong>
            <small>{isJoined ? 'Соединение установлено' : 'Вы не в голосовом канале'}</small>
          </div>
          {!isJoined ? <button className="modal-primary" type="button" onClick={() => joinVoiceChannel()}>Войти</button> : null}
        </header>
        <div className="voice-layout">
          <aside>
            <h3>В канале - {participants.length}</h3>
            {participants.map(({ participant, user }) => (
              <span key={user.id}>
                <i className={`avatar avatar-${user.status}`}>{user.avatar}</i>
                {user.displayName}
                {participant.muted ? <MicOff size={13} /> : null}
              </span>
            ))}
            {!participants.length ? <small>Пока никого нет.</small> : null}
          </aside>
          <div className="speaker-stage">
            {participants.map(({ user }) => (
              <article key={user.id}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <strong>{user.displayName}</strong>
              </article>
            ))}
          </div>
        </div>
        <div className="voice-controls">
          <button className={muted ? 'is-on' : ''} type="button" onClick={() => setMuted(!muted)}>{muted ? <MicOff size={17} /> : <Mic size={17} />}Mute</button>
          <button className={deafened ? 'is-on' : ''} type="button" onClick={() => setDeafened(!deafened)}><Volume2 size={17} />Deafen</button>
          <button className={camera ? 'is-on' : ''} type="button" onClick={() => setCamera(!camera)}><Video size={17} />Видео</button>
          <button className={screenSharing ? 'is-on' : ''} type="button" onClick={() => setScreenSharing(!screenSharing)}><MonitorUp size={17} />Экран</button>
          <button className="leave-button" type="button" onClick={leaveVoiceChannel}><Phone size={17} /></button>
        </div>
      </section>
    </main>
  )
}
