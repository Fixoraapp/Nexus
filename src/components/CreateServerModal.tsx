import { Gamepad2, Rocket, Users, X, Zap } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'setActiveModal'>

export function CreateServerModal({ setActiveModal }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="nexus-modal">
        <header>
          <h2>Создать сервер</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <label>
          Название сервера
          <input placeholder="Мое сообщество" />
        </label>
        <div className="icon-picker">
          {['N', '🎮', '🚀', '💎', '🎧', '👥'].map((icon) => <button type="button" key={icon}>{icon}</button>)}
        </div>
        <div className="template-grid">
          <button type="button"><Gamepad2 size={18} />Gaming</button>
          <button type="button"><Zap size={18} />Work</button>
          <button type="button"><Rocket size={18} />Creator</button>
          <button type="button"><Users size={18} />Study</button>
        </div>
        <button className="modal-primary" type="button" onClick={() => setActiveModal(null)}>Создать сервер</button>
      </section>
    </div>
  )
}
