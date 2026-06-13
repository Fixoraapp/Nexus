import { MonitorUp, X } from 'lucide-react'
import type { NexusActivity } from '../services/activityService'

type Props = {
  activity: NexusActivity | null
  clearActivity: () => void
  openActivityModal: () => void
}

export function ActivityCard({ activity, clearActivity, openActivityModal }: Props) {
  if (!activity?.visible) {
    return (
      <button className="activity-card is-empty" type="button" onClick={openActivityModal}>
        <span className="activity-app-icon">+</span>
        <span>
          <strong>Нет активной активности</strong>
          <small>Выбрать вручную</small>
        </span>
        <MonitorUp size={16} />
      </button>
    )
  }

  return (
    <div className="activity-card">
      <button className="activity-card-main" type="button" onClick={openActivityModal}>
        <span className="activity-app-icon">{activity.icon}</span>
        <span>
          <strong>{activity.name}</strong>
          <small>{activity.details || activity.state || 'Активность запущена'}</small>
        </span>
        <MonitorUp size={16} />
      </button>
      <button className="activity-clear" type="button" onClick={clearActivity} title="Скрыть активность">
        <X size={14} />
      </button>
    </div>
  )
}
