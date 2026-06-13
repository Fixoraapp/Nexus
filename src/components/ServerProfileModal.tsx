import { X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'currentUser' | 'serverProfiles' | 'setActiveModal' | 'updateServerProfile'>

export function ServerProfileModal({ activeServer, currentUser, serverProfiles, setActiveModal, updateServerProfile }: Props) {
  if (!activeServer || !currentUser) return null
  const profile = serverProfiles.find((item) => item.serverId === activeServer.id && item.userId === currentUser.id)

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Профиль на сервере</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          updateServerProfile(activeServer.id, {
            avatar: String(formData.get('avatar') || ''),
            nickname: String(formData.get('nickname') || currentUser.displayName),
          })
          setActiveModal(null)
        }}>
          <label>Никнейм на сервере<input name="nickname" defaultValue={profile?.nickname || currentUser.displayName} required /></label>
          <label>Avatar override<input name="avatar" defaultValue={profile?.avatar || ''} placeholder="N или URL позже" /></label>
          <button className="modal-primary" type="submit">Сохранить профиль сервера</button>
        </form>
      </section>
    </div>
  )
}
