import { CalendarDays, Hash, MessageCircle, Volume2, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import type { NexusStore } from '../store/nexusStore'
import type { ChannelCategory, ChannelType } from '../types'

type Props = Pick<NexusStore, 'createChannel' | 'setActiveModal'>

const channelTypes: Array<{ icon: LucideIcon; label: string; type: ChannelType }> = [
  { icon: Hash, label: 'Текст', type: 'text' },
  { icon: Volume2, label: 'Voice', type: 'voice' },
  { icon: MessageCircle, label: 'Forum', type: 'forum' },
  { icon: CalendarDays, label: 'Event', type: 'event' },
]

export function CreateChannelModal({ createChannel, setActiveModal }: Props) {
  const [type, setType] = useState<ChannelType>('text')
  const [isPrivate, setPrivate] = useState(false)
  const category: ChannelCategory = isPrivate ? 'private' : type === 'voice' ? 'voice' : type === 'event' ? 'events' : 'text'

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal">
        <header>
          <h2>Создать канал</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          createChannel({
            category,
            isPrivate,
            name: String(formData.get('name') || ''),
            type,
          })
        }}>
          <div className="channel-type-grid">
            {channelTypes.map(({ icon: Icon, label, type: itemType }) => (
              <button className={type === itemType ? 'is-active' : ''} type="button" key={itemType} onClick={() => setType(itemType)}>
                <Icon size={18} />
                <span>{label}</span>
                <small>{itemType === 'voice' ? 'Голосовая комната' : 'Сообщения и обсуждения'}</small>
              </button>
            ))}
          </div>
          <label>
            Название канала
            <input name="name" placeholder="new-channel" required />
          </label>
          <label className="switch-row">
            Приватный канал
            <input checked={isPrivate} type="checkbox" onChange={(event) => setPrivate(event.target.checked)} />
          </label>
          <button className="modal-primary" type="submit">Создать канал</button>
        </form>
      </section>
    </div>
  )
}
