import { LogOut, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'setActiveModal' | 'users'>

const sections = ['Профиль', 'Внешний вид', 'Уведомления', 'Приватность', 'Горячие клавиши', 'Голос и видео']

export function SettingsModal({ setActiveModal, users }: Props) {
  const user = users[0]

  return (
    <div className="modal-backdrop">
      <section className="settings-modal">
        <aside>
          {sections.map((section, index) => <button className={index === 0 ? 'is-active' : ''} type="button" key={section}>{section}</button>)}
          <button className="logout-button" type="button"><LogOut size={16} />Выйти</button>
        </aside>
        <main>
          <header>
            <h2>Настройки пользователя</h2>
            <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
          </header>
          <div className="settings-profile">
            <span className="avatar avatar-online">{user.avatar}</span>
            <div>
              <strong>{user.displayName}</strong>
              <small>{user.email}</small>
              <button type="button">Изменить аватар</button>
            </div>
          </div>
          <label>
            Отображаемое имя
            <input defaultValue={user.displayName} />
          </label>
          <label>
            Статус
            <select defaultValue="online">
              <option>online</option>
              <option>idle</option>
              <option>dnd</option>
            </select>
          </label>
          <label>
            О себе
            <textarea defaultValue="Строим будущее вместе с Nexus." />
          </label>
          <button className="modal-primary" type="button" onClick={() => setActiveModal(null)}>Сохранить изменения</button>
        </main>
      </section>
    </div>
  )
}
