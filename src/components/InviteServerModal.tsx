import { Copy, RefreshCw, Send, X } from 'lucide-react'
import { useState } from 'react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServer' | 'createInvite' | 'invites' | 'setActiveModal' | 'showSoon' | 'showToast'>

export function InviteServerModal({ activeServer, createInvite, invites, setActiveModal, showSoon, showToast }: Props) {
  const [generatedCode, setGeneratedCode] = useState('')
  if (!activeServer) return null

  const currentInvite = invites.filter((invite) => invite.serverId === activeServer.id).at(-1)
  const code = generatedCode || currentInvite?.code || ''
  const link = `nexus.gg/${code}`
  const copy = async () => {
    const nextCode = code || createInvite(activeServer.id)
    await navigator.clipboard?.writeText(`nexus.gg/${nextCode}`)
    showToast('Приглашение скопировано')
  }

  return (
    <div className="modal-backdrop">
      <section className="nexus-modal server-action-modal">
        <header>
          <h2>Пригласить на сервер</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <p className="modal-muted-text">Отправьте ссылку друзьям, чтобы они присоединились к серверу {activeServer.name}.</p>
        <label>
          Invite link
          <div className="copy-field"><input readOnly value={link} /><button type="button" onClick={copy}><Copy size={16} /></button></div>
        </label>
        <div className="modal-action-row">
          <button className="modal-secondary" type="button" onClick={() => setGeneratedCode(createInvite(activeServer.id))}><RefreshCw size={16} />Regenerate</button>
          <button className="modal-primary" type="button" onClick={() => showSoon('Приглашение друзей скоро будет доступно')}><Send size={16} />Invite friends</button>
        </div>
      </section>
    </div>
  )
}
