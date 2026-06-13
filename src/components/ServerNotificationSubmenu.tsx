type Props = {
  serverId: string
  updateServerNotificationPreference: (serverId: string, value: 'all' | 'mentions' | 'none') => void
  value: 'all' | 'mentions' | 'none'
}

const options = [
  { label: 'Все сообщения', value: 'all' },
  { label: 'Только упоминания', value: 'mentions' },
  { label: 'Ничего', value: 'none' },
] as const

export function ServerNotificationSubmenu({ serverId, updateServerNotificationPreference, value }: Props) {
  return (
    <div className="server-submenu">
      {options.map((option) => (
        <button className={option.value === value ? 'is-selected' : ''} key={option.value} type="button" onClick={() => updateServerNotificationPreference(serverId, option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  )
}
