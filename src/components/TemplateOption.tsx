import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  description?: string
  icon: LucideIcon
  onClick: () => void
  title: string
}

export function TemplateOption({ description, icon: Icon, onClick, title }: Props) {
  return (
    <button className="template-option" type="button" onClick={onClick}>
      <span className="template-option-icon"><Icon size={19} /></span>
      <span>
        <strong>{title}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <ChevronRight size={18} />
    </button>
  )
}
