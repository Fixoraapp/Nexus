import { Mic, MicOff, MonitorUp, MoreHorizontal, Phone, Video, Volume2 } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<
  NexusStore,
  | 'camera'
  | 'deafened'
  | 'muted'
  | 'screenSharing'
  | 'setCamera'
  | 'setDeafened'
  | 'setMuted'
  | 'setScreenSharing'
  | 'users'
  | 'voiceParticipants'
>

export function VoiceRoom(props: Props) {
  const { camera, deafened, muted, screenSharing, setCamera, setDeafened, setMuted, setScreenSharing, users, voiceParticipants } = props
  const speakers = voiceParticipants.filter((participant) => participant.speaking)

  return (
    <main className="voice-room">
      <section className="voice-section-card">
        <div className="voice-section-heading">
          <div>
            <span className="eyebrow">LIVE</span>
            <h2>Активные спикеры — {speakers.length}</h2>
          </div>
          <strong className="live-badge">LIVE</strong>
        </div>
        <div className="speaker-grid">
          {speakers.map((participant) => {
            const user = users.find((item) => item.id === participant.userId) ?? users[0]
            return (
              <article className="speaker-card" key={participant.userId}>
                <span className="avatar speaker-avatar avatar-online">{user.avatar}</span>
                <strong>{user.displayName}</strong>
                <small>Говорит</small>
              </article>
            )
          })}
        </div>
      </section>

      <section className="voice-section-card">
        <h2>Участники — {voiceParticipants.length}</h2>
        <div className="participant-grid">
          {voiceParticipants.map((participant) => {
            const user = users.find((item) => item.id === participant.userId) ?? users[0]
            return (
              <article className="participant-card" key={participant.userId}>
                <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                <strong>{user.displayName}</strong>
                <small>{participant.muted ? 'Микрофон выключен' : 'Слушает'}</small>
              </article>
            )
          })}
        </div>
      </section>

      <div className="voice-controls">
        <button className={muted ? 'is-on' : ''} type="button" onClick={() => setMuted(!muted)}>{muted ? <MicOff size={19} /> : <Mic size={19} />}Mute</button>
        <button className={deafened ? 'is-on' : ''} type="button" onClick={() => setDeafened(!deafened)}><Volume2 size={19} />Deafen</button>
        <button className={camera ? 'is-on' : ''} type="button" onClick={() => setCamera(!camera)}><Video size={19} />Видео</button>
        <button className={screenSharing ? 'is-on' : ''} type="button" onClick={() => setScreenSharing(!screenSharing)}><MonitorUp size={19} />Экран</button>
        <button type="button"><MoreHorizontal size={19} />Еще</button>
        <button className="leave-button" type="button"><Phone size={19} />Выйти</button>
      </div>
    </main>
  )
}
