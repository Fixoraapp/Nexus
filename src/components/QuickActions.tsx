import { Calendar, MessageCircle, Plus, UserPlus } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'setActiveModal'>

export function QuickActions({ setActiveModal }: Props) {
  return (
    <section className="quick-actions">
      <button type="button" onClick={() => setActiveModal('addServer')}><Plus size={18} />Создать сервер</button>
      <button type="button"><UserPlus size={18} />Войти на сервер</button>
      <button type="button" onClick={() => setActiveModal('createChannel')}><Calendar size={18} />Создать событие</button>
      <button type="button"><MessageCircle size={18} />Новое сообщение</button>
    </section>
  )
}
