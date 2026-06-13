import type { UserStatus } from '../types'

type Props = {
  currentStatus: UserStatus
  onChange: (status: UserStatus) => void
}

const statuses: Array<{ label: string; status: UserStatus; text: string }> = [
  { label: 'Online', status: 'online', text: 'В сети' },
  { label: 'Idle', status: 'idle', text: 'Отошел' },
  { label: 'Do Not Disturb', status: 'dnd', text: 'Не беспокоить' },
  { label: 'Invisible', status: 'offline', text: 'Невидимый' },
]

export function StatusMenu({ currentStatus, onChange }: Props) {
  return (
    <div className="status-menu" role="menu">
      {statuses.map((item) => (
        <button
          className={item.status === currentStatus ? 'is-selected' : ''}
          key={item.status}
          onClick={() => onChange(item.status)}
          type="button"
        >
          <i className={`status-dot status-${item.status}`} />
          <span>
            <strong>{item.label}</strong>
            <small>{item.text}</small>
          </span>
        </button>
      ))}
    </div>
  )
}
