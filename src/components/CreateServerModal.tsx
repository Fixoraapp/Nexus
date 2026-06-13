import { Lock, Unlock, X } from 'lucide-react'
import { useState } from 'react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'createServer' | 'setActiveModal'>

const icons = ['N', 'S', 'C', 'W', 'G', 'L']
const colors = ['#6d5dff', '#35c2ff', '#35d07f', '#f5b84b', '#ff5d73', '#a855f7']

export function CreateServerModal({ createServer, setActiveModal }: Props) {
  const [color, setColor] = useState(colors[0])
  const [icon, setIcon] = useState(icons[0])
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal">
        <header>
          <h2>Создать сервер</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          createServer({
            color,
            description: String(formData.get('description') || ''),
            icon,
            name: String(formData.get('name') || ''),
            privacy,
          })
        }}>
          <label>
            Название сервера
            <input name="name" placeholder="Мое сообщество" required />
          </label>
          <label>
            Описание
            <input name="description" placeholder="О чем этот сервер" />
          </label>
          <div className="icon-picker">
            {icons.map((item) => <button className={icon === item ? 'is-selected' : ''} type="button" key={item} onClick={() => setIcon(item)}>{item}</button>)}
          </div>
          <div className="color-picker">
            {colors.map((item) => <button className={color === item ? 'is-selected' : ''} style={{ background: item }} type="button" key={item} onClick={() => setColor(item)} />)}
          </div>
          <div className="template-grid">
            <button className={privacy === 'public' ? 'is-selected' : ''} type="button" onClick={() => setPrivacy('public')}><Unlock size={18} />Public</button>
            <button className={privacy === 'private' ? 'is-selected' : ''} type="button" onClick={() => setPrivacy('private')}><Lock size={18} />Private</button>
          </div>
          <button className="modal-primary" type="submit">Создать сервер</button>
        </form>
      </section>
    </div>
  )
}
