import { Bell, CreditCard, LogOut, Mic, Palette, Shield, User, X } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'setActiveModal' | 'users'>

const sections = [
  { icon: CreditCard, label: 'Мой аккаунт' },
  { icon: User, label: 'Профиль' },
  { icon: Palette, label: 'Внешний вид' },
  { icon: Bell, label: 'Уведомления' },
  { icon: Mic, label: 'Голос и видео' },
  { icon: Shield, label: 'Приватность' },
]

export function SettingsModal({ setActiveModal, users }: Props) {
  const user = users[0]

  return (
    <div className="modal-backdrop">
      <section className="settings-modal settings-modal-redesign">
        <aside>
          {sections.map(({ icon: Icon, label }, index) => (
            <button className={index === 1 ? 'is-active' : ''} type="button" key={label}>
              <Icon size={16} />
              {label}
            </button>
          ))}
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
              <strong>{user.displayName}#4231</strong>
              <small>Онлайн</small>
              <button type="button">Изменить аватар</button>
            </div>
          </div>
          <label>Отображаемое имя<input defaultValue={user.displayName} /></label>
          <label>Имя пользователя<input defaultValue={user.username} /></label>
          <label>О себе<textarea defaultValue="Люблю технологии и общение 🚀" /></label>
          <label>Статус<select defaultValue="online"><option value="online">Онлайн</option><option value="idle">Отошёл</option><option value="dnd">Не беспокоить</option></select></label>
          <button className="modal-primary" type="button" onClick={() => setActiveModal(null)}>Сохранить изменения</button>
        </main>
      </section>
    </div>
  )
}
