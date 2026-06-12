import { Calendar } from 'lucide-react'
import type { NexusEvent } from '../types'

export function EventCard({ event }: { event: NexusEvent }) {
  return (
    <article className="event-card">
      <Calendar size={18} />
      <div>
        <strong>{event.title}</strong>
        <span>{event.date}</span>
      </div>
    </article>
  )
}
