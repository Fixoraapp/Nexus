import { Hash, MessageCircle, Volume2, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'setActiveModal'>

export function CreateChannelModal({ setActiveModal }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="nexus-modal">
        <header>
          <h2>Создать канал</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <div className="channel-type-grid">
          <button className="is-active" type="button"><Hash size={18} /><span>Текст</span><small>Сообщения, файлы, GIF</small></button>
          <button type="button"><Volume2 size={18} /><span>Voice</span><small>Голосовая комната</small></button>
          <button type="button"><MessageCircle size={18} /><span>Forum</span><small>Темы и обсуждения</small></button>
        </div>
        <label>
          Название канала
          <input placeholder="new-channel" />
        </label>
        <label className="switch-row">
          Приватный канал
          <input type="checkbox" />
        </label>
        <button className="modal-primary" type="button" onClick={() => setActiveModal(null)}>Создать канал</button>
      </section>
    </div>
  )
}
