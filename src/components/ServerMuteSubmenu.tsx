type Props = {
  muteServer: (serverId: string, duration: '15m' | '1h' | '8h' | '24h' | 'forever') => void
  serverId: string
}

const durations = [
  { label: 'На 15 минут', value: '15m' },
  { label: 'На 1 час', value: '1h' },
  { label: 'На 8 часов', value: '8h' },
  { label: 'На 24 часа', value: '24h' },
  { label: 'До включения', value: 'forever' },
] as const

export function ServerMuteSubmenu({ muteServer, serverId }: Props) {
  return (
    <div className="server-submenu">
      {durations.map((duration) => (
        <button key={duration.value} type="button" onClick={() => muteServer(serverId, duration.value)}>
          {duration.label}
        </button>
      ))}
    </div>
  )
}
