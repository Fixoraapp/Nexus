import { X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'createCategory' | 'setActiveModal'>

export function CreateCategoryModal({ activeServer, createCategory, setActiveModal }: Props) {
  if (!activeServer) return null

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Создать категорию</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <form className="modal-form" onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.currentTarget)
          createCategory(activeServer.id, String(formData.get('name') || ''))
        }}>
          <label>Название категории<input autoFocus name="name" placeholder="Например: Проекты" required /></label>
          <button className="modal-primary" type="submit">Создать категорию</button>
        </form>
      </section>
    </div>
  )
}
