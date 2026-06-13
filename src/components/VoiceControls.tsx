import { Headphones, Mic, MicOff, MonitorUp, MoreHorizontal, Phone, Radio, Video } from 'lucide-react'

type Props = {
  camera: boolean
  deafened: boolean
  leaveVoiceChannel: () => void
  muted: boolean
  screenSharing: boolean
  toggleCamera: () => void
  toggleDeafen: () => void
  toggleMute: () => void
  toggleScreenShare: () => void
}

export function VoiceControls({ camera, deafened, leaveVoiceChannel, muted, screenSharing, toggleCamera, toggleDeafen, toggleMute, toggleScreenShare }: Props) {
  return (
    <div className="voice-call-controls">
      <button className={muted ? 'is-danger-active' : ''} type="button" onClick={toggleMute} title={muted ? 'Включить микрофон' : 'Выключить микрофон'}>
        {muted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      <button className={deafened ? 'is-active' : ''} type="button" onClick={toggleDeafen} title="Заглушить звук"><Headphones size={20} /></button>
      <button className={camera ? 'is-active' : ''} type="button" onClick={toggleCamera} title="Видео"><Video size={20} /></button>
      <button className={screenSharing ? 'is-active' : ''} type="button" onClick={toggleScreenShare} title="Показ экрана"><MonitorUp size={20} /></button>
      <button type="button" title="Soundboard"><Radio size={20} /></button>
      <button type="button" title="Еще"><MoreHorizontal size={20} /></button>
      <button className="voice-leave-control" type="button" onClick={leaveVoiceChannel} title="Покинуть канал"><Phone size={20} /></button>
    </div>
  )
}
