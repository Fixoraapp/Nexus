import { Compass, Gamepad2, MessageCircle, Plus, Settings } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'activeServerId' | 'selectServer' | 'servers' | 'setActiveModal'>

const iconMap = [MessageCircle, Gamepad2, Compass]

export function ServerRail({ activeServerId, selectServer, servers, setActiveModal }: Props) {
  return (
    <aside className="server-rail" aria-label="Серверы">
      <button className="rail-home is-active" type="button" onClick={() => selectServer('nexus')} title="Nexus Home">
        N
      </button>
      <div className="rail-list">
        {servers.slice(1).map((server, index) => {
          const Icon = iconMap[index % iconMap.length]
          return (
            <button
              className={`rail-server ${server.id === activeServerId ? 'is-active' : ''}`}
              key={server.id}
              type="button"
              onClick={() => selectServer(server.id)}
              title={server.name}
            >
              {index < 3 ? <Icon size={20} /> : <span>{server.icon}</span>}
            </button>
          )
        })}
      </div>
      <button className="rail-action" type="button" onClick={() => setActiveModal('createServer')} title="Добавить сервер">
        <Plus size={22} />
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
