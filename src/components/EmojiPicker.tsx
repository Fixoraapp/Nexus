type Props = {
  onPick: (emoji: string) => void
}

const emojis = ['👍', '🔥', '💜', '😂', '🚀', '👀', '✅', '🎉']

export function EmojiPicker({ onPick }: Props) {
  return (
    <div className="emoji-picker">
      {emojis.map((emoji) => (
        <button key={emoji} type="button" onClick={() => onPick(emoji)}>{emoji}</button>
      ))}
    </div>
  )
}
