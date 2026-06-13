import { Shield, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'setActiveModal' | 'showToast' | 'updateServerPrivacy'>

export function ServerPrivacyModal({ activeServer, setActiveModal, showToast, updateServerPrivacy }: Props) {
  if (!activeServer) return null

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Конфиденциальность</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          updateServerPrivacy(activeServer.id, { privacy: String(formData.get('privacy')) === 'private' ? 'private' : 'public' })
          showToast('Дополнительные privacy настройки сохранены локально')
          setActiveModal(null)
        }}>
          <label>Доступность<select name="privacy" defaultValue={activeServer.privacy || 'private'}><option value="public">Public</option><option value="private">Private</option></select></label>
          <label className="switch-row">Разрешить приглашения<input defaultChecked type="checkbox" /></label>
          <label className="switch-row">Разрешить DM от участников<input defaultChecked type="checkbox" /></label>
          <label>Уровень проверки<select defaultValue="medium"><option value="none">Нет</option><option value="medium">Средний</option><option value="high">Высокий</option></select></label>
          <button className="modal-primary" type="submit"><Shield size={16} />Сохранить</button>
        </form>
      </section>
    </div>
  )
}
