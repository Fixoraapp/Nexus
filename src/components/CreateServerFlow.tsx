import { ArrowLeft, BriefcaseBusiness, Check, Gamepad2, GraduationCap, Lock, Palette, Sparkles, Unlock, Users, Video, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import type { CreateServerInput } from '../store/nexusStore'
import { TemplateOption } from './TemplateOption'
import { JoinServerModal } from './JoinServerModal'

type Template = {
  color: string
  icon: string
  id: string
  label: string
  visual: typeof Sparkles
}

type Props = {
  createServer: (data: CreateServerInput) => void
  joinServerByInvite: (code: string) => boolean
  onClose: () => void
}

const templates: Template[] = [
  { color: '#6D5DFF', icon: 'N', id: 'custom', label: 'Свой шаблон', visual: Sparkles },
  { color: '#8B5CF6', icon: 'G', id: 'games', label: 'Игры', visual: Gamepad2 },
  { color: '#35C2FF', icon: 'F', id: 'friends', label: 'Друзья', visual: Users },
  { color: '#35D07F', icon: 'U', id: 'study', label: 'Учебная группа', visual: GraduationCap },
  { color: '#F5B84B', icon: 'S', id: 'school', label: 'Школьный клуб', visual: Palette },
  { color: '#FF5D73', icon: 'W', id: 'work', label: 'Работа / команда', visual: BriefcaseBusiness },
  { color: '#A855F7', icon: 'C', id: 'creator', label: 'Creator / блог', visual: Video },
]

const colors = ['#6D5DFF', '#35C2FF', '#35D07F', '#F5B84B', '#FF5D73', '#A855F7']

export function CreateServerFlow({ createServer, joinServerByInvite, onClose }: Props) {
  const [step, setStep] = useState<'choice' | 'audience' | 'details' | 'join'>('choice')
  const [template, setTemplate] = useState<Template>(templates[0])
  const [audience, setAudience] = useState<'friends' | 'community'>('friends')
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public')
  const [color, setColor] = useState(templates[0].color)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isCreating, setCreating] = useState(false)

  const defaultName = useMemo(() => {
    if (template.id === 'custom') return ''
    return template.label
  }, [template])

  const chooseTemplate = (nextTemplate: Template) => {
    setTemplate(nextTemplate)
    setColor(nextTemplate.color)
    setName(nextTemplate.id === 'custom' ? '' : nextTemplate.label)
    setStep('audience')
  }

  const create = () => {
    const serverName = (name || defaultName).trim()
    if (!serverName) {
      setError('Введите название сервера')
      return
    }

    setError('')
    setCreating(true)
    window.setTimeout(() => {
      createServer({
        color,
        description,
        icon: template.icon,
        name: serverName,
        privacy,
        template: `${template.label} / ${audience === 'friends' ? 'Для меня и друзей' : 'Для клуба или сообщества'}`,
      })
      setCreating(false)
    }, 320)
  }

  return (
    <AnimatePresence mode="wait">
      {step === 'choice' ? (
        <motion.section
          className="add-server-card"
          key="choice"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22 }}
        >
          <button className="add-server-close" type="button" onClick={onClose}><X size={18} /></button>
          <header className="add-server-heading">
            <span className="add-server-mark">N</span>
            <h2>Создайте свой сервер</h2>
            <p>Ваш сервер - это место, где вы можете тусоваться со своими друзьями. Создайте сервер и начните общаться.</p>
          </header>
          <div className="template-option-list">
            {templates.map((item) => (
              <TemplateOption icon={item.visual} key={item.id} title={item.label} onClick={() => chooseTemplate(item)} />
            ))}
          </div>
          <footer className="add-server-join">
            <strong>У вас уже есть приглашение?</strong>
            <button type="button" onClick={() => setStep('join')}>Присоединиться к серверу</button>
          </footer>
        </motion.section>
      ) : null}

      {step === 'audience' ? (
        <motion.section
          className="add-server-card"
          key="audience"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          <button className="add-server-close" type="button" onClick={onClose}><X size={18} /></button>
          <header className="add-server-heading">
            <span className="add-server-mark" style={{ background: `linear-gradient(135deg, ${color}, #35C2FF)` }}>{template.icon}</span>
            <h2>Расскажите нам о сервере</h2>
            <p>Это поможет Nexus настроить стартовое пространство под ваш сценарий.</p>
          </header>
          <div className="audience-grid">
            <button className={audience === 'friends' ? 'is-selected' : ''} type="button" onClick={() => setAudience('friends')}>
              <Users size={20} />
              <span><strong>Для меня и друзей</strong><small>Небольшое приватное пространство</small></span>
              {audience === 'friends' ? <Check size={18} /> : null}
            </button>
            <button className={audience === 'community' ? 'is-selected' : ''} type="button" onClick={() => setAudience('community')}>
              <Sparkles size={20} />
              <span><strong>Для клуба или сообщества</strong><small>Публичный или растущий сервер</small></span>
              {audience === 'community' ? <Check size={18} /> : null}
            </button>
          </div>
          <div className="add-server-actions">
            <button className="flow-secondary" type="button" onClick={() => setStep('choice')}><ArrowLeft size={16} />Назад</button>
            <button className="flow-primary" type="button" onClick={() => setStep('details')}>Продолжить</button>
          </div>
        </motion.section>
      ) : null}

      {step === 'details' ? (
        <motion.section
          className="add-server-card"
          key="details"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22 }}
        >
          <button className="add-server-close" type="button" onClick={onClose}><X size={18} /></button>
          <header className="add-server-heading">
            <span className="add-server-mark" style={{ background: `linear-gradient(135deg, ${color}, #35C2FF)` }}>{template.icon}</span>
            <h2>Настройте ваш сервер</h2>
            <p>Название, приватность и стиль можно изменить позже в настройках.</p>
          </header>
          <div className="server-details-grid">
            <div className="server-icon-preview" style={{ background: `linear-gradient(135deg, ${color}, rgba(109, 93, 255, 0.46))` }}>{template.icon}</div>
            <div className="server-detail-fields">
              <label>Название сервера<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Мой сервер" /></label>
              <label>Описание<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="О чем это пространство" /></label>
            </div>
          </div>
          <div className="privacy-toggle">
            <button className={privacy === 'public' ? 'is-selected' : ''} type="button" onClick={() => setPrivacy('public')}><Unlock size={17} />Public</button>
            <button className={privacy === 'private' ? 'is-selected' : ''} type="button" onClick={() => setPrivacy('private')}><Lock size={17} />Private</button>
          </div>
          <div className="flow-color-picker">
            {colors.map((item) => <button className={color === item ? 'is-selected' : ''} key={item} style={{ background: item }} type="button" onClick={() => setColor(item)} />)}
          </div>
          {error ? <p className="add-server-error">{error}</p> : null}
          <div className="add-server-actions">
            <button className="flow-secondary" type="button" onClick={() => setStep('audience')}><ArrowLeft size={16} />Назад</button>
            <button className="flow-primary" type="button" disabled={isCreating} onClick={create}>{isCreating ? 'Создаем...' : 'Create Server'}</button>
          </div>
        </motion.section>
      ) : null}

      {step === 'join' ? (
        <JoinServerModal key="join" joinServerByInvite={joinServerByInvite} onBack={() => setStep('choice')} onClose={onClose} />
      ) : null}
    </AnimatePresence>
  )
}
