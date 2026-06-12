import { Radio, TrendingUp, Users, Zap } from 'lucide-react'
import type { NexusStore } from '../store/nexusStore'
import { ActivityFeed } from './ActivityFeed'
import { EventCard } from './EventCard'
import { QuickActions } from './QuickActions'

type Props = NexusStore

export function DashboardHome(store: Props) {
  const { activeServer, events, messages, users } = store

  return (
    <main className="dashboard-home">
      <section className="welcome-card">
        <div>
          <span className="eyebrow">Главная</span>
          <h1>Добро пожаловать в Nexus</h1>
          <p>{activeServer.description}</p>
        </div>
        <strong>Nexus Version 1.0.2</strong>
      </section>

      <QuickActions setActiveModal={store.setActiveModal} />

      <section className="dashboard-stats">
        <div className="stat-card"><Users size={20} /><span>Участники онлайн</span><strong>{activeServer.onlineCount}</strong></div>
        <div className="stat-card"><MessageCircleIcon /><span>Сообщений сегодня</span><strong>520</strong></div>
        <div className="stat-card"><Radio size={20} /><span>Активные комнаты</span><strong>18</strong></div>
        <div className="stat-card"><TrendingUp size={20} /><span>Рост за неделю</span><strong>+14%</strong></div>
      </section>

      <div className="dashboard-columns">
        <section className="active-rooms app-card">
          <h2>Активные комнаты</h2>
          {['Gaming', 'Design Lounge', 'Strategy Meeting'].map((room, index) => (
            <div className="room-row" key={room}>
              <Zap size={16} />
              <div><strong>{room}</strong><span>{index + 3} участника</span></div>
              {index === 0 ? <em>LIVE</em> : null}
            </div>
          ))}
        </section>
        <ActivityFeed messages={messages} users={users} />
        <section className="events-list app-card">
          <h2>Ближайшие события</h2>
          {events.map((event) => <EventCard event={event} key={event.id} />)}
        </section>
      </div>
    </main>
  )
}

function MessageCircleIcon() {
  return <Zap size={20} />
}
