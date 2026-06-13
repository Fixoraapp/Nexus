import { Compass, Plus, Settings } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServerId' | 'openAddServerModal' | 'selectServer' | 'servers' | 'setActiveModal' | 'showSoon'>

export function ServerRail({ activeServerId, openAddServerModal, selectServer, servers, setActiveModal, showSoon }: Props) {
  return (
    <aside className="server-rail" aria-label="Серверы">
      <button className={`rail-home ${!activeServerId ? 'is-active' : ''}`} type="button" onClick={() => selectServer('')} title="Nexus Home">
        N
      </button>
      <div className="rail-list">
        {servers.map((server) => (
          <button
            className={`rail-server ${server.id === activeServerId ? 'is-active' : ''}`}
            key={server.id}
            style={{ background: server.color ? `linear-gradient(135deg, ${server.color}, rgba(109, 93, 255, 0.5))` : undefined }}
            type="button"
            onClick={() => selectServer(server.id)}
            title={server.name}
          >
            <span>{server.icon}</span>
          </button>
        ))}
      </div>
      <button className="rail-action" type="button" onClick={openAddServerModal} title="Добавить сервер">
        <Plus size={22} />
      </button>
      <button className="rail-action" type="button" onClick={() => showSoon('Обзор сообществ скоро будет доступен')} title="Обзор сообществ">
        <Compass size={20} />
      </button>
      <button className="rail-action rail-bottom" type="button" onClick={() => setActiveModal('settings')} title="Настройки">
        <Settings size={20} />
      </button>
    </aside>
  )
}
