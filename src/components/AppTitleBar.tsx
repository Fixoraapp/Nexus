import { Minus, Square, X } from 'lucide-react'

export function AppTitleBar() {
  return (
    <header className="app-title-bar">
      <div className="app-title-brand">
        <span className="app-title-logo">N</span>
        <strong>Nexus</strong>
      </div>
      <div className="app-title-spacer" />
      <div className="window-controls">
        <button type="button" onClick={() => window.windowControls?.minimize()} aria-label="Свернуть">
          <Minus size={16} />
        </button>
        <button type="button" onClick={() => window.windowControls?.maximize()} aria-label="Развернуть">
          <Square size={14} />
        </button>
        <button className="window-close" type="button" onClick={() => window.windowControls?.close()} aria-label="Закрыть">
          <X size={16} />
        </button>
      </div>
    </header>
  )
}
