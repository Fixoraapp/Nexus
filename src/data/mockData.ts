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
  { id: `${serverId}-general`, serverId, name: 'general', type: 'text', category: 'text', isPrivate: false, description: 'Общий чат для всех участников сервера.', unreadCount: 5 },
  { id: `${serverId}-design`, serverId, name: 'design', type: 'text', category: 'text', isPrivate: false, description: 'Дизайн, интерфейсы и визуальные решения.' },
  { id: `${serverId}-development`, serverId, name: 'development', type: 'text', category: 'text', isPrivate: false, description: 'Разработка, релизы и технические задачи.' },
  { id: `${serverId}-marketing`, serverId, name: 'marketing', type: 'forum', category: 'text', isPrivate: false, description: 'Идеи продвижения и запусков.' },
  { id: `${serverId}-off-topic`, serverId, name: 'off-topic', type: 'text', category: 'text', isPrivate: false, description: 'Неформальное общение.' },
  { id: `${serverId}-feedback`, serverId, name: 'feedback', type: 'forum', category: 'text', isPrivate: false, description: 'Отзывы и предложения.' },
  { id: `${serverId}-lounge`, serverId, name: 'Lounge', type: 'voice', category: 'voice', isPrivate: false, description: 'Свободная голосовая комната.' },
  { id: `${serverId}-gaming`, serverId, name: 'Gaming', type: 'voice', category: 'voice', isPrivate: false, description: 'Игровая voice-комната.' },
  { id: `${serverId}-music`, serverId, name: 'Music', type: 'voice', category: 'voice', isPrivate: true, description: 'Музыка и фоновые созвоны.' },
  { id: `${serverId}-afk`, serverId, name: 'AFK', type: 'voice', category: 'voice', isPrivate: true, description: 'Комната ожидания.' },
]

export const roles: Role[] = [
  { id: 'owner', name: 'Владелец', color: '#F5B84B', priority: 100, permissions: ['*'] },
  { id: 'admin', name: 'Админ', color: '#FF5D73', priority: 80, permissions: ['manage_channels', 'manage_roles'] },
  { id: 'moderator', name: 'Модератор', color: '#35C2FF', priority: 60, permissions: ['mute', 'delete_messages'] },
  { id: 'member', name: 'Участник', color: '#6D5DFF', priority: 20, permissions: ['send_messages'] },
]

export const users: User[] = [
  { id: 'u1', username: 'ethan', displayName: 'Итан Браун', avatar: 'EB', status: 'online', activity: 'Онлайн', roleIds: ['admin'], email: 'ethan@nexus.app' },
  { id: 'u2', username: 'alex', displayName: 'Алекс Джонсон', avatar: 'AJ', status: 'online', activity: 'Онлайн', roleIds: ['owner'], email: 'alex@nexus.app' },
  { id: 'u3', username: 'maya', displayName: 'Майя Пател', avatar: 'MP', status: 'online', activity: 'Работает над релизом', roleIds: ['admin'], email: 'maya@nexus.app' },
  { id: 'u4', username: 'olivia', displayName: 'Оливия Дэвис', avatar: 'OD', status: 'online', activity: 'В голосовом канале', roleIds: ['moderator'], email: 'olivia@nexus.app' },
  { id: 'u5', username: 'noah', displayName: 'Ной Уилсон', avatar: 'NW', status: 'online', activity: 'Проверяет roadmap', roleIds: ['moderator'], email: 'noah@nexus.app' },
  { id: 'u6', username: 'liam', displayName: 'Лиам Тейлор', avatar: 'LT', status: 'online', activity: 'Онлайн', roleIds: ['member'], email: 'liam@nexus.app' },
  { id: 'u7', username: 'sophia', displayName: 'София Мартинес', avatar: 'SM', status: 'dnd', activity: 'Отошла', roleIds: ['member'], email: 'sophia@nexus.app' },
  { id: 'u8', username: 'jackson', displayName: 'Джексон Ли', avatar: 'JL', status: 'offline', activity: 'Офлайн', roleIds: ['member'], email: 'jackson@nexus.app' },
  { id: 'u9', username: 'ava', displayName: 'Ава Томпсон', avatar: 'AT', status: 'online', activity: 'Пишет сообщение', roleIds: ['member'], email: 'ava@nexus.app' },
  { id: 'u10', username: 'lucas', displayName: 'Лукас Миллер', avatar: 'LM', status: 'dnd', activity: 'Смотрит макеты', roleIds: ['member'], email: 'lucas@nexus.app' },
  { id: 'u11', username: 'emma', displayName: 'Эмма Гарсия', avatar: 'EG', status: 'idle', activity: 'На встрече', roleIds: ['member'], email: 'emma@nexus.app' },
  { id: 'u12', username: 'mason', displayName: 'Мейсон Кларк', avatar: 'MC', status: 'online', activity: 'Запускает тесты', roleIds: ['member'], email: 'mason@nexus.app' },
  { id: 'u13', username: 'mia', displayName: 'Мия Родригес', avatar: 'MR', status: 'idle', activity: 'Фокус-режим', roleIds: ['member'], email: 'mia@nexus.app' },
]

export const servers: Server[] = [
  { id: 'nexus', name: 'Nexus Community', icon: 'N', description: 'Главное пространство Nexus для команды и сообщества.', memberCount: 1247, onlineCount: 312, ownerId: 'u2', channels: channels('nexus') },
  { id: 'design', name: 'Design Ops', icon: 'D', description: 'Дизайн-система, ревью и запуск интерфейсов.', memberCount: 482, onlineCount: 96, ownerId: 'u3', channels: channels('design') },
  { id: 'gaming', name: 'Gaming Night', icon: 'G', description: 'Игровые комнаты, турниры и живой voice.', memberCount: 860, onlineCount: 241, ownerId: 'u1', channels: channels('gaming') },
  { id: 'builders', name: 'Builders Lab', icon: 'B', description: 'Продуктовая лаборатория для создателей.', memberCount: 691, onlineCount: 143, ownerId: 'u5', channels: channels('builders') },
  { id: 'study', name: 'Study Room', icon: 'S', description: 'Учебные группы, созвоны и совместная работа.', memberCount: 533, onlineCount: 88, ownerId: 'u4', channels: channels('study') },
]

export const messages: Message[] = [
  { id: 'm1', channelId: 'nexus-general', authorId: 'u9', content: 'Всем привет! 👋\nКак ваши дела сегодня?', timestamp: 'сегодня, 15:13', reactions: [{ emoji: '👍', count: 12 }, { emoji: '🔥', count: 5 }, { emoji: '❤️', count: 3 }] },
  { id: 'm2', channelId: 'nexus-general', authorId: 'u5', content: 'Работаем над новым обновлением, скоро будет доступно! 🚀', timestamp: 'сегодня, 15:16', reactions: [{ emoji: '🔥', count: 7 }, { emoji: '🎉', count: 4 }] },
  { id: 'm3', channelId: 'nexus-general', authorId: 'u4', content: 'Кто хочет зайти в голосовой канал? Lounge свободен 😉', timestamp: 'сегодня, 15:18', reactions: [{ emoji: '👍', count: 6 }] },
  { id: 'm4', channelId: 'nexus-general', authorId: 'u1', content: 'Отличная идея! Сейчас зайду.', timestamp: 'сегодня, 15:20', reactions: [], replyTo: 'm1' },
  { id: 'm5', channelId: 'nexus-general', authorId: 'u9', content: 'Не забудьте про собрание завтра в 20:00 по МСК!', timestamp: 'сегодня, 15:22', reactions: [] },
  { id: 'm6', channelId: 'nexus-general', authorId: 'u3', content: 'Спасибо за напоминание!', timestamp: 'сегодня, 15:24', reactions: [{ emoji: '✅', count: 8 }] },
]

export const voiceParticipants: VoiceParticipant[] = [
  { userId: 'u9', speaking: true, muted: false, deafened: false, camera: false, screenSharing: false },
  { userId: 'u5', speaking: true, muted: false, deafened: false, camera: true, screenSharing: false },
  { userId: 'u4', speaking: false, muted: false, deafened: false, camera: false, screenSharing: true },
]

export const events: NexusEvent[] = [
  { id: 'e1', title: 'Gaming Night', date: 'Сегодня, 20:00', serverId: 'nexus', channelId: 'nexus-gaming' },
  { id: 'e2', title: 'Design Review', date: 'Завтра, 15:00', serverId: 'nexus', channelId: 'nexus-design' },
]

export const notifications: NexusNotification[] = [
  { id: 'n1', title: 'Новое упоминание', body: 'Майя упомянула вас в #general', read: false, type: 'mention' },
  { id: 'n2', title: 'Событие скоро начнется', body: 'Gaming Night начнется сегодня в 20:00', read: false, type: 'event' },
]
