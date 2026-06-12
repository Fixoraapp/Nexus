import type {
  Channel,
  Message,
  NexusEvent,
  NexusNotification,
  Role,
  Server,
  User,
  VoiceParticipant,
} from '../types'

const channels = (serverId: string): Channel[] => [
  { id: `${serverId}-welcome`, serverId, name: 'welcome', type: 'text', category: 'information', isPrivate: false, description: 'Приветствие и правила входа в сообщество.' },
  { id: `${serverId}-announcements`, serverId, name: 'announcements', type: 'text', category: 'information', isPrivate: false, description: 'Важные объявления Nexus.', unreadCount: 2 },
  { id: `${serverId}-rules`, serverId, name: 'rules', type: 'text', category: 'information', isPrivate: false, description: 'Правила, роли и безопасность.' },
  { id: `${serverId}-general`, serverId, name: 'general', type: 'text', category: 'text', isPrivate: false, description: 'Общий чат для команды и участников.', unreadCount: 5 },
  { id: `${serverId}-design`, serverId, name: 'design', type: 'text', category: 'text', isPrivate: false, description: 'Дизайн, UI, ассеты и визуальные решения.' },
  { id: `${serverId}-development`, serverId, name: 'development', type: 'text', category: 'text', isPrivate: false, description: 'Разработка, релизы и технические задачи.', unreadCount: 1 },
  { id: `${serverId}-marketing`, serverId, name: 'marketing', type: 'forum', category: 'text', isPrivate: false, description: 'Идеи продвижения и запусков.' },
  { id: `${serverId}-off-topic`, serverId, name: 'off-topic', type: 'text', category: 'text', isPrivate: true, description: 'Неформальное общение.' },
  { id: `${serverId}-feedback`, serverId, name: 'feedback', type: 'forum', category: 'text', isPrivate: true, description: 'Отзывы и предложения.' },
  { id: `${serverId}-lounge`, serverId, name: 'Lounge', type: 'voice', category: 'voice', isPrivate: false, description: 'Свободная голосовая комната.' },
  { id: `${serverId}-gaming`, serverId, name: 'Gaming', type: 'voice', category: 'voice', isPrivate: false, description: 'Игровая voice-комната.' },
  { id: `${serverId}-music`, serverId, name: 'Music', type: 'voice', category: 'voice', isPrivate: true, description: 'Музыка и фоновые созвоны.' },
  { id: `${serverId}-afk`, serverId, name: 'AFK', type: 'voice', category: 'voice', isPrivate: true, description: 'Комната ожидания.' },
  { id: `${serverId}-events`, serverId, name: 'events', type: 'event', category: 'events', isPrivate: false, description: 'События сообщества.' },
  { id: `${serverId}-roadmap`, serverId, name: 'roadmap', type: 'event', category: 'events', isPrivate: false, description: 'План развития продукта.' },
  { id: `${serverId}-staff-room`, serverId, name: 'staff-room', type: 'text', category: 'private', isPrivate: true, description: 'Комната команды модерации.' },
  { id: `${serverId}-admin-chat`, serverId, name: 'admin-chat', type: 'text', category: 'private', isPrivate: true, description: 'Админский чат.' },
]

export const roles: Role[] = [
  { id: 'owner', name: 'Владелец', color: '#F5B84B', priority: 100, permissions: ['*'] },
  { id: 'admin', name: 'Админ', color: '#FF5D73', priority: 80, permissions: ['manage_channels', 'manage_roles'] },
  { id: 'moderator', name: 'Модератор', color: '#35C2FF', priority: 60, permissions: ['mute', 'delete_messages'] },
  { id: 'member', name: 'Участник', color: '#6D5DFF', priority: 20, permissions: ['send_messages'] },
  { id: 'guest', name: 'Гость', color: '#8D99B8', priority: 5, permissions: ['read'] },
]

export const users: User[] = [
  { id: 'u1', username: 'alex', displayName: 'Алекс Джонсон', avatar: 'AJ', status: 'online', activity: 'Online', roleIds: ['owner'], email: 'alex@nexus.app' },
  { id: 'u2', username: 'maya', displayName: 'Майя Пател', avatar: 'MP', status: 'online', activity: 'Работает над релизом', roleIds: ['admin'], email: 'maya@nexus.app' },
  { id: 'u3', username: 'ethan', displayName: 'Итан Браун', avatar: 'EB', status: 'dnd', activity: 'Не беспокоить', roleIds: ['admin'], email: 'ethan@nexus.app' },
  { id: 'u4', username: 'olivia', displayName: 'Оливия Дэвис', avatar: 'OD', status: 'online', activity: 'В голосовом канале', roleIds: ['moderator'], email: 'olivia@nexus.app' },
  { id: 'u5', username: 'noah', displayName: 'Ной Уилсон', avatar: 'NW', status: 'online', activity: 'Проверяет roadmap', roleIds: ['moderator'], email: 'noah@nexus.app' },
  { id: 'u6', username: 'liam', displayName: 'Лиам Тейлор', avatar: 'LT', status: 'online', activity: 'Online', roleIds: ['member'], email: 'liam@nexus.app' },
  { id: 'u7', username: 'sophia', displayName: 'София Мартинес', avatar: 'SM', status: 'idle', activity: 'Отошла', roleIds: ['member'], email: 'sophia@nexus.app' },
  { id: 'u8', username: 'jackson', displayName: 'Джексон Ли', avatar: 'JL', status: 'offline', activity: 'Offline', roleIds: ['member'], email: 'jackson@nexus.app' },
  { id: 'u9', username: 'ava', displayName: 'Ава Томпсон', avatar: 'AT', status: 'online', activity: 'Пишет сообщение', roleIds: ['member'], email: 'ava@nexus.app' },
  { id: 'u10', username: 'lucas', displayName: 'Лукас Миллер', avatar: 'LM', status: 'online', activity: 'Смотрит макеты', roleIds: ['member'], email: 'lucas@nexus.app' },
  { id: 'u11', username: 'emma', displayName: 'Эмма Гарсия', avatar: 'EG', status: 'idle', activity: 'На встрече', roleIds: ['member'], email: 'emma@nexus.app' },
  { id: 'u12', username: 'mason', displayName: 'Мейсон Кларк', avatar: 'MC', status: 'online', activity: 'Запускает тесты', roleIds: ['member'], email: 'mason@nexus.app' },
  { id: 'u13', username: 'mia', displayName: 'Мия Родригес', avatar: 'MR', status: 'dnd', activity: 'Фокус-режим', roleIds: ['guest'], email: 'mia@nexus.app' },
  { id: 'u14', username: 'henry', displayName: 'Генри Кинг', avatar: 'HK', status: 'offline', activity: 'Offline', roleIds: ['guest'], email: 'henry@nexus.app' },
  { id: 'u15', username: 'ella', displayName: 'Элла Янг', avatar: 'EY', status: 'online', activity: 'Готовит событие', roleIds: ['member'], email: 'ella@nexus.app' },
]

export const servers: Server[] = [
  { id: 'nexus', name: 'Nexus Community', icon: 'N', description: 'Главное пространство Nexus для команды и сообщества.', memberCount: 1247, onlineCount: 312, ownerId: 'u1', channels: channels('nexus') },
  { id: 'design', name: 'Design Ops', icon: 'D', description: 'Дизайн-система, ревью и запуск интерфейсов.', memberCount: 482, onlineCount: 96, ownerId: 'u2', channels: channels('design') },
  { id: 'gaming', name: 'Gaming Night', icon: 'G', description: 'Игровые комнаты, турниры и живой voice.', memberCount: 860, onlineCount: 241, ownerId: 'u3', channels: channels('gaming') },
  { id: 'builders', name: 'Builders Lab', icon: 'B', description: 'Продуктовая лаборатория для создателей.', memberCount: 691, onlineCount: 143, ownerId: 'u5', channels: channels('builders') },
  { id: 'study', name: 'Study Room', icon: 'S', description: 'Учебные группы, созвоны и совместная работа.', memberCount: 533, onlineCount: 88, ownerId: 'u4', channels: channels('study') },
]

export const messages: Message[] = Array.from({ length: 20 }, (_, index) => {
  const authors = ['u1', 'u2', 'u3', 'u4', 'u5', 'u9', 'u10']
  const texts = [
    'Добро пожаловать в Nexus! Обязательно прочитайте правила и представьтесь команде.',
    'Сегодня полируем desktop-интерфейс: каналы, voice room и панель участников.',
    'Мне нравится новая структура. Интерфейс ощущается гораздо серьезнее.',
    'Добавил заметки по roadmap, посмотрите блок событий.',
    'Кто сможет зайти в voice через десять минут?',
    'Проверил последние макеты, кнопки и hover-состояния стали аккуратнее.',
    'Отлично, после сборки нужно пройтись по auth и update overlay.',
  ]

  return {
    id: `m${index + 1}`,
    channelId: 'nexus-general',
    authorId: authors[index % authors.length],
    content: texts[index % texts.length],
    timestamp: `сегодня ${String(9 + Math.floor(index / 3)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
    reactions: index % 3 === 0 ? [{ emoji: '👍', count: 2 + index }, { emoji: '⚡', count: 1 }] : [],
    replyTo: index === 8 ? 'm2' : undefined,
    edited: index === 11,
  }
})

export const voiceParticipants: VoiceParticipant[] = [
  { userId: 'u1', speaking: true, muted: false, deafened: false, camera: false, screenSharing: false },
  { userId: 'u2', speaking: true, muted: false, deafened: false, camera: true, screenSharing: false },
  { userId: 'u3', speaking: false, muted: false, deafened: false, camera: false, screenSharing: false },
  { userId: 'u4', speaking: false, muted: false, deafened: false, camera: false, screenSharing: true },
  { userId: 'u5', speaking: false, muted: false, deafened: false, camera: false, screenSharing: false },
  { userId: 'u6', speaking: false, muted: true, deafened: false, camera: false, screenSharing: false },
]

export const events: NexusEvent[] = [
  { id: 'e1', title: 'Gaming Night', date: 'Сегодня, 20:00', serverId: 'nexus', channelId: 'nexus-events' },
  { id: 'e2', title: 'Design Review', date: 'Завтра, 15:00', serverId: 'nexus', channelId: 'nexus-roadmap' },
  { id: 'e3', title: 'Community AMA', date: '15 июня, 21:00', serverId: 'nexus', channelId: 'nexus-events' },
]

export const notifications: NexusNotification[] = [
  { id: 'n1', title: 'Новое упоминание', body: 'Майя упомянула вас в #general', read: false, type: 'mention' },
  { id: 'n2', title: 'Событие скоро начнется', body: 'Gaming Night начнется сегодня в 20:00', read: false, type: 'event' },
  { id: 'n3', title: 'Система обновлена', body: 'Nexus готов к работе', read: true, type: 'system' },
]
