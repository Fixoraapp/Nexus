import { X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'setActiveModal' | 'updateServer'>

const colors = ['#6D5DFF', '#35C2FF', '#35D07F', '#F5B84B', '#FF5D73', '#9B7BFF']

export function ServerSettingsModal({ activeServer, setActiveModal, updateServer }: Props) {
  if (!activeServer) return null

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Настройки сервера</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          updateServer(activeServer.id, {
            color: String(formData.get('color') || activeServer.color),
            description: String(formData.get('description') || ''),
            icon: String(formData.get('icon') || activeServer.icon).slice(0, 2).toUpperCase(),
            name: String(formData.get('name') || activeServer.name).trim(),
          })
          setActiveModal(null)
        }}>
          <label>Название сервера<input name="name" defaultValue={activeServer.name} required /></label>
          <label>Описание<textarea name="description" defaultValue={activeServer.description} /></label>
          <label>Иконка<input name="icon" defaultValue={activeServer.icon} maxLength={2} /></label>
          <label>Цвет<select name="color" defaultValue={activeServer.color || colors[0]}>{colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>
          <button className="modal-primary" type="submit">Сохранить</button>
        </form>
      </section>
    </div>
  )
}
