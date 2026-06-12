import { Bell } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'notifications'>

export function NotificationBell({ notifications }: Props) {
  const unread = notifications.filter((notification) => !notification.read).length

  return (
    <button className="icon-button notification-button" type="button" title="Уведомления">
      <Bell size={18} />
      {unread ? <span>{unread}</span> : null}
    </button>
  )
}
