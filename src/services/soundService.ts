function playTone(startFrequency: number, endFrequency: number, duration = 0.16, volume = 0.08) {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(startFrequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)
    window.setTimeout(() => void context.close(), Math.ceil(duration * 1000) + 80)
  } catch {
    // Audio is optional; UI state must keep working when WebAudio is unavailable.
  }
}

export const soundService = {
  playVoiceJoin() {
    playTone(420, 760, 0.18, 0.09)
  },

  playVoiceLeave() {
    playTone(620, 260, 0.2, 0.075)
  },

  playMute() {
    playTone(300, 300, 0.06, 0.055)
  },

  playDeafen() {
    playTone(520, 220, 0.1, 0.06)
  },

  playMessage() {
    playTone(660, 880, 0.11, 0.045)
  },
}
