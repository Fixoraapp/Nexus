import { CalendarDays, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'createEvent' | 'setActiveModal'>

export function CreateEventModal({ activeServer, createEvent, setActiveModal }: Props) {
  if (!activeServer) return null
  const eventChannels = activeServer.channels.filter((channel) => channel.type !== 'voice')

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Создать событие</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          createEvent(activeServer.id, {
            channelId: String(formData.get('channelId') || eventChannels[0]?.id || ''),
            dateTime: String(formData.get('dateTime') || ''),
            description: String(formData.get('description') || ''),
            title: String(formData.get('title') || ''),
          })
        }}>
          <label>Название события<input name="title" placeholder="Community night" required /></label>
          <label>Дата и время<input name="dateTime" required type="datetime-local" /></label>
          <label>Канал<select name="channelId">{eventChannels.map((channel) => <option key={channel.id} value={channel.id}>#{channel.name}</option>)}</select></label>
          <label>Описание<textarea name="description" placeholder="О чем событие" /></label>
          <button className="modal-primary" type="submit"><CalendarDays size={16} />Создать событие</button>
        </form>
      </section>
    </div>
  )
}
