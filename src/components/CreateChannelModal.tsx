import { Briefcase, Hash, Megaphone, MessageCircle, Volume2, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { NexusStore } from '../store/nexusStore'
import type { ChannelCategory, ChannelType } from '../types'
import { ChannelTypeOption } from './ChannelTypeOption'

type Props = Pick<
  NexusStore,
  | 'activeServer'
  | 'createChannel'
  | 'createChannelContext'
  | 'currentUser'
  | 'serverCategories'
  | 'serverUsers'
  | 'setActiveModal'
  | 'showToast'
>

const channelTypes: Array<{ description: string; icon: LucideIcon; label: string; type: ChannelType }> = [
  { description: 'Отправляйте сообщения, изображения, GIF, эмодзи, мнения и приколы', icon: Hash, label: 'Текст', type: 'text' },
  { description: 'Общайтесь голосом или в видеочате и пользуйтесь функцией показа экрана', icon: Volume2, label: 'Голос', type: 'voice' },
  { description: 'Создайте площадку для обсуждений', icon: MessageCircle, label: 'Форум', type: 'forum' },
  { description: 'Важные сообщения для обитателей сервера и всех остальных', icon: Megaphone, label: 'Объявление', type: 'announcement' },
  { description: 'Проводите события, круглые столы и конференции', icon: Briefcase, label: 'Проект', type: 'project' },
]

const categoryLabels: Record<ChannelCategory, string> = {
  events: 'События',
  information: 'Информация',
  private: 'Приватные',
  text: 'Текстовые каналы',
  voice: 'Голосовые каналы',
}

function sanitizeChannelName(value: string) {
  return value
    .trimStart()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}._-]+/gu, '')
    .replace(/-+/g, '-')
}

function defaultCategoryForType(type: ChannelType): ChannelCategory {
  if (type === 'voice') return 'voice'
  if (type === 'project') return 'events'
  return 'text'
}

function canCreateChannel(currentUser: Props['currentUser'], activeServer: Props['activeServer'], serverUsers: Props['serverUsers']) {
  if (!currentUser || !activeServer) return false
  if (activeServer.ownerId === currentUser.id) return true
  const member = serverUsers.find((user) => user.id === currentUser.id)
  return Boolean(member?.roleIds.some((role) => role === 'owner' || role === 'admin'))
}

export function CreateChannelModal({ activeServer, createChannel, createChannelContext, currentUser, serverCategories, serverUsers, setActiveModal, showToast }: Props) {
  const [type, setType] = useState<ChannelType>(createChannelContext?.defaultType ?? 'text')
  const [name, setName] = useState('')
  const [isPrivate, setPrivate] = useState(false)
  const [permissionMode, setPermissionMode] = useState<'onlyMe' | 'members' | 'roles'>('onlyMe')
  const fallbackCategory = createChannelContext?.category ?? defaultCategoryForType(type)
  const [categoryValue, setCategoryValue] = useState(createChannelContext?.categoryId ?? fallbackCategory)
  const allowed = canCreateChannel(currentUser, activeServer, serverUsers)

  const categoryOptions = useMemo(() => {
    if (!activeServer) return []
    return [
      { id: 'information', label: 'Информация' },
      { id: 'text', label: 'Текстовые каналы' },
      { id: 'voice', label: 'Голосовые каналы' },
      ...serverCategories.filter((category) => category.serverId === activeServer.id).map((category) => ({ id: category.id, label: category.name })),
    ]
  }, [activeServer, serverCategories])

  if (!activeServer) return null

  const selectedCustomCategory = serverCategories.find((category) => category.id === categoryValue)
  const selectedCategory = selectedCustomCategory ? 'text' : categoryValue as ChannelCategory
  const selectedCategoryId = selectedCustomCategory?.id
  const subtitle = selectedCustomCategory?.name ?? categoryLabels[selectedCategory] ?? categoryLabels[fallbackCategory]
  const duplicate = activeServer.channels.some((channel) =>
    channel.name.toLowerCase() === name.toLowerCase()
    && channel.category === selectedCategory
    && (channel.categoryId ?? '') === (selectedCategoryId ?? ''),
  )
  const isVoice = type === 'voice'
  const inputPrefix = isVoice ? <Volume2 size={16} /> : '#'
  const canSubmit = allowed && Boolean(name.trim()) && !duplicate

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const created = createChannel({
      category: selectedCategory,
      categoryId: selectedCategoryId,
      isPrivate,
      name,
      permissions: isPrivate ? { mode: permissionMode, roleIds: [], userIds: currentUser ? [currentUser.id] : [] } : undefined,
      serverId: activeServer.id,
      type,
    })

    if (!created) {
      showToast('Не удалось создать канал')
    }
  }

  return (
    <div className="modal-backdrop create-channel-backdrop">
      <section className="create-channel-modal">
        <header>
          <div>
            <h2>Создать канал</h2>
            <p>в {subtitle}</p>
          </div>
          <button type="button" onClick={() => setActiveModal(null)} aria-label="Закрыть"><X size={18} /></button>
        </header>

        <form onSubmit={submit}>
          {!allowed ? <p className="create-channel-error">Недостаточно прав для создания каналов.</p> : null}

          <div className="channel-type-list">
            {channelTypes.map((item) => (
              <ChannelTypeOption
                description={item.description}
                icon={item.icon}
                isSelected={type === item.type}
                key={item.type}
                label={item.label}
                onSelect={(nextType) => {
                  setType(nextType)
                  if (!createChannelContext?.categoryId && !createChannelContext?.category) {
                    setCategoryValue(defaultCategoryForType(nextType))
                  }
                }}
                type={item.type}
              />
            ))}
          </div>

          <label className="create-channel-label">
            Название канала
            <span className="channel-name-input">
              <i>{inputPrefix}</i>
              <input autoFocus disabled={!allowed} onChange={(event) => setName(sanitizeChannelName(event.target.value))} placeholder="новый-канал" value={name} />
            </span>
          </label>

          {!createChannelContext?.categoryId ? (
            <label className="create-channel-label">
              Категория
              <select disabled={!allowed} value={categoryValue} onChange={(event) => setCategoryValue(event.target.value)}>
                {categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}
              </select>
            </label>
          ) : null}

          {duplicate ? <p className="create-channel-error">Канал с таким названием уже существует в этой категории.</p> : null}

          <label className="private-channel-toggle">
            <span>
              <strong>Приватный канал</strong>
              <small>Только выбранные участники и участники с выбранными ролями смогут просматривать этот канал.</small>
            </span>
            <input checked={isPrivate} disabled={!allowed} type="checkbox" onChange={(event) => setPrivate(event.target.checked)} />
          </label>

          {isPrivate ? (
            <section className="channel-permission-section">
              <strong>Кто может видеть канал</strong>
              {[
                { label: 'Только я', value: 'onlyMe' },
                { label: 'Выбрать участников', value: 'members' },
                { label: 'Выбрать роли', value: 'roles' },
              ].map((option) => (
                <button className={permissionMode === option.value ? 'is-selected' : ''} key={option.value} type="button" onClick={() => setPermissionMode(option.value as typeof permissionMode)}>
                  <span className="channel-radio" />
                  {option.label}
                </button>
              ))}
            </section>
          ) : null}

          <footer>
            <button className="create-channel-cancel" type="button" onClick={() => setActiveModal(null)}>Отмена</button>
            <button className="create-channel-submit" disabled={!canSubmit} type="submit">Создать канал</button>
          </footer>
        </form>
      </section>
    </div>
  )
}
