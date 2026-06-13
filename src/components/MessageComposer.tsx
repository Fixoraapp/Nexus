import { Gift, Plus, Send, Smile } from 'lucide-react'
import { useState } from 'react'

type Props = {
  channelName: string
  sendMessage: (content: string) => void
}

export function MessageComposer({ channelName, sendMessage }: Props) {
  const [value, setValue] = useState('')

  const submit = () => {
    sendMessage(value)
    setValue('')
  }

  return (
    <div className="message-composer">
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
      <button type="button" title="Эмодзи"><Smile size={20} /></button>
      <button className="send-button" type="button" onClick={submit} title="Отправить">
        <Send size={20} />
      </button>
    </div>
  )
}
