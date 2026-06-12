import { Search } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'roles' | 'setActiveModal' | 'users'>

export function MembersPanel({ roles, setActiveModal, users }: Props) {
  const grouped = roles
    .sort((a, b) => b.priority - a.priority)
    .map((role) => ({
      role,
      users: users.filter((user) => user.roleIds.includes(role.id)),
    }))
    .filter((group) => group.users.length)

  const offline = users.filter((user) => user.status === 'offline')

  return (
    <aside className="members-panel">
      <label className="member-search">
        <Search size={15} />
        <input placeholder="Найти участника" />
      </label>
      {grouped.map(({ role, users: groupUsers }) => (
        <section className="member-group" key={role.id}>
          <h3 style={{ color: role.color }}>{role.name.toUpperCase()} — {groupUsers.length}</h3>
          {groupUsers.map((user) => (
            <button className="member-row" key={user.id} type="button" onClick={() => setActiveModal('profile')}>
              <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
              <span>
                <strong>{user.displayName}</strong>
                <small>{user.activity}</small>
              </span>
            </button>
          ))}
        </section>
      ))}
      <section className="member-group">
        <h3>OFFLINE — {offline.length}</h3>
      </section>
    </aside>
  )
}
