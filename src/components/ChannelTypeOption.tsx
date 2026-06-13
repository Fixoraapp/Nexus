import type { LucideIcon } from 'lucide-react'
import type { ChannelType } from '../types'

type Props = {
  description: string
  icon: LucideIcon
  isSelected: boolean
  label: string
  onSelect: (type: ChannelType) => void
  type: ChannelType
}

export function ChannelTypeOption({ description, icon: Icon, isSelected, label, onSelect, type }: Props) {
  return (
    <button className={isSelected ? 'channel-type-option is-selected' : 'channel-type-option'} type="button" onClick={() => onSelect(type)}>
      <span className="channel-radio" />
      <Icon size={21} />
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
    </button>
  )
}
