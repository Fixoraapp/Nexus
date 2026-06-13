import { Gift, Plus, Send, Smile } from 'lucide-react'
import { useState } from 'react'
import { EmojiPicker } from './EmojiPicker'

type Props = {
  channelName: string
  sendMessage: (content: string) => void
}

export function MessageComposer({ channelName, sendMessage }: Props) {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [value, setValue] = useState('')
  const canSend = Boolean(value.trim())

  const submit = () => {
    if (!canSend) return
    sendMessage(value)
    setValue('')
  }

  return (
    <div className="message-composer pro-message-composer">
      <button type="button" title="Добавить вложение"><Plus size={20} /></button>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        placeholder={`Написать #${channelName}`}
        rows={1}
      />
      <button type="button" title="Подарок"><Gift size={20} /></button>
      <button className="gif-button" type="button" title="GIF">GIF</button>
      <span className="composer-emoji-wrap">
        <button type="button" onClick={() => setEmojiOpen((value) => !value)} title="Эмодзи"><Smile size={20} /></button>
        {emojiOpen ? <EmojiPicker onPick={(emoji) => setValue((current) => `${current}${emoji}`)} /> : null}
      </span>
      <button className="send-button" disabled={!canSend} type="button" onClick={submit} title="Отправить">
        <Send size={20} />
      </button>
    </div>
  )
}
