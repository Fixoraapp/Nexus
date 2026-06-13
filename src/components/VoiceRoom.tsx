import { Mic, MicOff, MonitorUp, Phone, Video, Volume2 } from 'lucide-react'
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
  const listeners = users.filter((user) => ['u3', 'u4', 'u6', 'u7'].includes(user.id))

  return (
    <main className="voice-room voice-room-redesign">
      <section className="voice-panel">
        <header>
          <div>
            <strong>Gaming</strong>
            <small>Установлено соединение</small>
          </div>
        </header>
        <div className="voice-layout">
          <aside>
            <h3>Говорят — {speakers.length}</h3>
            {speakers.map((participant) => {
              const user = users.find((item) => item.id === participant.userId) ?? users[0]
              return <span key={user.id}><i className={`avatar avatar-${user.status}`}>{user.avatar}</i>{user.displayName}</span>
            })}
            <h3>Слушают — {listeners.length}</h3>
            {listeners.map((user) => <span key={user.id}><i className={`avatar avatar-${user.status}`}>{user.avatar}</i>{user.displayName}</span>)}
          </aside>
          <div className="speaker-stage">
            {speakers.slice(0, 3).map((participant) => {
              const user = users.find((item) => item.id === participant.userId) ?? users[0]
              return (
                <article key={user.id}>
                  <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
                  <strong>{user.displayName}</strong>
                </article>
              )
            })}
          </div>
        </div>
        <div className="voice-controls">
          <button className={muted ? 'is-on' : ''} type="button" onClick={() => setMuted(!muted)}>{muted ? <MicOff size={17} /> : <Mic size={17} />}Mute</button>
          <button className={deafened ? 'is-on' : ''} type="button" onClick={() => setDeafened(!deafened)}><Volume2 size={17} />Deafen</button>
          <button className={camera ? 'is-on' : ''} type="button" onClick={() => setCamera(!camera)}><Video size={17} />Видео</button>
          <button className={screenSharing ? 'is-on' : ''} type="button" onClick={() => setScreenSharing(!screenSharing)}><MonitorUp size={17} />Экран</button>
          <button className="leave-button" type="button"><Phone size={17} /></button>
        </div>
      </section>
    </main>
  )
}
