import { Headphones, Mic, MicOff, Settings } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'currentUser' | 'deafened' | 'muted' | 'setActiveModal' | 'setDeafened' | 'setMuted'>

export function UserProfileBar({ currentUser, deafened, muted, setActiveModal, setDeafened, setMuted }: Props) {
  const user = currentUser ?? {
    avatar: 'N',
    displayName: 'Nexus User',
    status: 'online',
    username: 'user',
  }

  return (
    <div className="user-profile-bar">
      <button className="profile-mini" type="button" onClick={() => setActiveModal('profile')}>
        <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
        <span>
          <strong>{user.displayName}</strong>
          <small>@{user.username}</small>
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
