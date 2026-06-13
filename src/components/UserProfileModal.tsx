import { Edit, LogOut, Settings, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { authService } from '../services/authService'

type Props = Pick<NexusStore, 'setActiveModal' | 'users'>

export function UserProfileModal({ setActiveModal, users }: Props) {
  const user = users[0] ?? { avatar: 'N', displayName: 'Nexus User', status: 'online', username: 'user' }

  return (
    <div className="modal-backdrop">
      <section className="profile-modal nexus-modal">
        <header>
          <h2>{user.displayName}</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <div className="profile-hero">
          <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
          <div>
            <strong>@{user.username}</strong>
            <small>Online</small>
          </div>
        </div>
        <div className="profile-command-grid">
          <button type="button">Set Status</button>
          <button type="button"><Edit size={16} />Edit Profile</button>
          <button type="button" onClick={() => setActiveModal('settings')}><Settings size={16} />Settings</button>
          <button type="button" onClick={() => {
            authService.logout()
            window.location.hash = '#/login'
          }}><LogOut size={16} />Log Out</button>
        </div>
        <div className="premium-box">
          <strong>NEXUS PREMIUM</strong>
          <span>Спасибо за поддержку Nexus.</span>
          <p>Custom Profile</p>
          <p>Premium Badge</p>
          <p>Higher Upload Limit</p>
        </div>
      </section>
    </div>
  )
}
