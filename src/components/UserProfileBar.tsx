import { Headphones, Mic, MicOff, Settings } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'deafened' | 'muted' | 'setActiveModal' | 'setDeafened' | 'setMuted' | 'users'>

export function UserProfileBar({ deafened, muted, setActiveModal, setDeafened, setMuted, users }: Props) {
  const user = users[0]

  return (
    <div className="user-profile-bar">
      <button className="profile-mini" type="button" onClick={() => setActiveModal('profile')}>
        <span className="avatar avatar-online">{user.avatar}</span>
        <span>
          <strong>{user.displayName}</strong>
          <small>Онлайн</small>
        </span>
      </button>
      <div className="profile-actions">
        <button className={muted ? 'is-on' : ''} type="button" onClick={() => setMuted(!muted)} title="Микрофон">
          {muted ? <MicOff size={17} /> : <Mic size={17} />}
        </button>
        <button className={deafened ? 'is-on' : ''} type="button" onClick={() => setDeafened(!deafened)} title="Наушники">
          <Headphones size={17} />
        </button>
        <button type="button" onClick={() => setActiveModal('settings')} title="Настройки">
          <Settings size={17} />
        </button>
      </div>
    </div>
  )
}
