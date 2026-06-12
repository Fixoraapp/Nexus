import { Compass, Plus, Settings } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServerId' | 'selectServer' | 'servers' | 'setActiveModal'>

export function ServerRail({ activeServerId, selectServer, servers, setActiveModal }: Props) {
  return (
    <aside className="server-rail" aria-label="Серверы">
      <button className="rail-home is-active" type="button" onClick={() => selectServer('nexus')} title="Nexus Home">
        N
      </button>
      <div className="rail-divider"></div>
      <div className="rail-list">
        {servers.map((server) => (
          <button
            className={`rail-server ${server.id === activeServerId ? 'is-active' : ''}`}
            key={server.id}
            type="button"
            onClick={() => selectServer(server.id)}
            title={server.name}
          >
            <span>{server.icon}</span>
          </button>
        ))}
      </div>
      <button className="rail-action" type="button" onClick={() => setActiveModal('createServer')} title="Добавить сервер">
        <Plus size={20} />
      </button>
      <button className="rail-action" type="button" title="Обзор сообществ">
        <Compass size={20} />
      </button>
      <button className="rail-action rail-bottom" type="button" onClick={() => setActiveModal('settings')} title="Настройки">
        <Settings size={20} />
      </button>
    </aside>
  )
}
