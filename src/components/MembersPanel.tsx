import { Search, UserPlus } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'

type Props = Pick<NexusStore, 'createInvite' | 'roles' | 'serverUsers' | 'setActiveModal' | 'voiceParticipants'>

export function MembersPanel({ createInvite, roles, serverUsers, setActiveModal, voiceParticipants }: Props) {
  const grouped = [...roles]
    .sort((a, b) => b.priority - a.priority)
    .map((role) => ({
      role,
      users: serverUsers.filter((user) => user.roleIds.includes(role.id)),
    }))
    .filter((group) => group.users.length)

  return (
    <aside className="members-panel">
      <label className="member-search">
        <Search size={17} />
        <input placeholder="Найти участника" />
      </label>
      {grouped.map(({ role, users }) => (
        <section className="member-group" key={role.id}>
          <h3 style={{ color: role.color }}>{role.name.toUpperCase()} - {users.length}</h3>
          {users.map((user) => (
            <button className="member-row" key={user.id} type="button" onClick={() => setActiveModal('profile')}>
              <span className={`avatar avatar-${user.status}`}>{user.avatar}</span>
              <span>
                <strong>{user.displayName}{role.id === 'owner' ? ' crown' : ''}</strong>
                <small>{voiceParticipants.some((participant) => participant.userId === user.id) ? 'В голосовом канале' : user.activity}</small>
              </span>
            </button>
          ))}
        </section>
      ))}
      {!grouped.length ? <p className="hidden-members">Участников пока нет</p> : null}
      <button className="invite-member" type="button" onClick={() => {
        const code = createInvite()
        window.navigator.clipboard?.writeText(code)
      }}>
        <UserPlus size={18} />
        Создать invite
      </button>
    </aside>
  )
}
