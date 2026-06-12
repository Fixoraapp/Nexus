import { Gift, Mic, Paperclip, Send, Smile } from 'lucide-react'
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
      <button type="button" title="Прикрепить файл"><Paperclip size={19} /></button>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            submit()
          }
        }}
        placeholder={`Message #${channelName}`}
        rows={1}
      />
      <button type="button" title="Подарок"><Gift size={19} /></button>
      <button type="button" title="Эмодзи"><Smile size={19} /></button>
      <button type="button" title="Голос"><Mic size={19} /></button>
      <button className="send-button" type="button" onClick={submit} title="Отправить">
        <Send size={18} />
      </button>
    </div>
  )
}
