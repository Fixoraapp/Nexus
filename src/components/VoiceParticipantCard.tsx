import { Headphones, MicOff, MonitorUp, Video } from 'lucide-react'
import type { NexusActivity } from '../services/activityService'
import type { User, VoiceParticipant } from '../types'

type Props = {
  activity: NexusActivity | null
  participant: VoiceParticipant
  user: User
}

export function VoiceParticipantCard({ activity, participant, user }: Props) {
  return (
    <article className={participant.speaking && !participant.muted ? 'voice-participant-card is-speaking' : 'voice-participant-card'}>
      <span className={`voice-participant-avatar avatar-${user.status}`}>{user.avatar}</span>
      <strong>{user.displayName}</strong>
      <small>{activity?.visible ? activity.name : 'В голосовом канале'}</small>
      <div className="voice-participant-badges">
        {participant.muted ? <span title="Микрофон выключен"><MicOff size={14} /></span> : null}
        {participant.deafened ? <span title="Заглушен звук"><Headphones size={14} /></span> : null}
        {participant.camera ? <span title="Видео"><Video size={14} /></span> : null}
        {participant.screenSharing ? <span title="Демонстрация экрана"><MonitorUp size={14} /></span> : null}
      </div>
    </article>
  )
}
