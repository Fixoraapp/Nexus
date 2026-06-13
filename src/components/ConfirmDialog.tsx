import { X } from 'lucide-react'

type Props = {
  cancelText?: string
  confirmText: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export function ConfirmDialog({ cancelText = 'Отмена', confirmText, message, onCancel, onConfirm, title }: Props) {
  return (
    <div className="modal-backdrop">
      <section className="nexus-modal compact-modal">
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onCancel}><X size={18} /></button>
        </header>
        <p className="modal-muted-text">{message}</p>
        <div className="modal-action-row">
          <button className="modal-secondary" type="button" onClick={onCancel}>{cancelText}</button>
          <button className="modal-danger" type="button" onClick={onConfirm}>{confirmText}</button>
        </div>
      </section>
    </div>
  )
}
