import { Code2, Gamepad2, Music, Pickaxe, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import type { NexusStore } from '../store/nexusStore'
import type { NexusActivity } from '../services/activityService'

type Props = Pick<NexusStore, 'clearActivity' | 'currentActivity' | 'setActiveModal' | 'setActivity'>

const presets: Array<Pick<NexusActivity, 'details' | 'icon' | 'name' | 'state' | 'type'> & { id: string }> = [
  { details: 'Строит новый город', icon: 'CS', id: 'construction-simulator', name: 'Construction Simulator', state: 'В игре', type: 'game' },
  { details: 'Работает над Nexus', icon: 'VS', id: 'vscode', name: 'Visual Studio Code', state: 'В приложении', type: 'app' },
  { details: 'Roleplay session', icon: 'GP', id: 'grand-rp', name: 'Grand RP', state: 'В игре', type: 'game' },
  { details: 'Слушает музыку', icon: 'SP', id: 'spotify', name: 'Spotify', state: 'Музыка', type: 'music' },
]

const presetIcons = [Pickaxe, Code2, Gamepad2, Music]

export function ActivityModal({ clearActivity, currentActivity, setActiveModal, setActivity }: Props) {
  const [selectedId, setSelectedId] = useState(currentActivity?.id || presets[0].id)
  const [customName, setCustomName] = useState(currentActivity?.type === 'custom' ? currentActivity.name : '')
  const [visible, setVisible] = useState(currentActivity?.visible ?? true)
  const isCustom = selectedId === 'custom'

  const save = () => {
    const preset = presets.find((item) => item.id === selectedId)
    const name = isCustom ? customName.trim() : preset?.name

    if (!name) {
      return
    }

    setActivity({
      details: isCustom ? 'Пользовательская активность' : preset?.details,
      icon: isCustom ? name.slice(0, 2).toUpperCase() : preset?.icon ?? 'NX',
      id: selectedId,
      name,
      state: isCustom ? 'Активен' : preset?.state,
      type: isCustom ? 'custom' : preset?.type ?? 'custom',
      visible,
    })
    setActiveModal(null)
  }

  return (
    <div className="modal-backdrop">
      <section className="activity-modal nexus-modal">
        <header>
          <h2>Активность</h2>
          <button type="button" onClick={() => setActiveModal(null)}><X size={18} /></button>
        </header>
        <div className="activity-preset-list">
          {presets.map((preset, index) => {
            const Icon = presetIcons[index]
            return (
              <button className={selectedId === preset.id ? 'is-selected' : ''} key={preset.id} type="button" onClick={() => setSelectedId(preset.id)}>
                <span><Icon size={18} /></span>
                <strong>{preset.name}</strong>
                <small>{preset.state}</small>
              </button>
            )
          })}
          <button className={selectedId === 'custom' ? 'is-selected' : ''} type="button" onClick={() => setSelectedId('custom')}>
            <span><Sparkles size={18} /></span>
            <strong>Custom Activity</strong>
            <small>Своя активность</small>
          </button>
        </div>
        {isCustom ? (
          <label>
            Название активности
            <input value={customName} onChange={(event) => setCustomName(event.target.value)} placeholder="Например: Designing Nexus" />
          </label>
        ) : null}
        <label className="switch-row">
          Показывать активность
          <input checked={visible} type="checkbox" onChange={(event) => setVisible(event.target.checked)} />
        </label>
        <div className="activity-modal-actions">
          <button className="flow-secondary" type="button" onClick={() => {
            clearActivity()
            setActiveModal(null)
          }}>Очистить активность</button>
          <button className="flow-primary" type="button" onClick={save}>Сохранить</button>
        </div>
      </section>
    </div>
  )
}
