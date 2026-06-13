let localStream: MediaStream | null = null
let activeChannelId: string | null = null

export const webrtcService = {
  async joinRoom(channelId: string) {
    activeChannelId = channelId
    try {
      localStream = await navigator.mediaDevices?.getUserMedia({ audio: true })
      return { microphoneAllowed: true, stream: localStream }
    } catch {
      localStream = null
      return { microphoneAllowed: false, stream: null }
    }
  },

  leaveRoom() {
    localStream?.getTracks().forEach((track) => track.stop())
    localStream = null
    activeChannelId = null
  },

  toggleMute(muted: boolean) {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !muted
    })
  },

  toggleDeafen() {
    return activeChannelId
  },

  async startScreenShare() {
    try {
      return await navigator.mediaDevices?.getDisplayMedia({ video: true })
    } catch {
      return null
    }
  },

  stopScreenShare(stream?: MediaStream | null) {
    stream?.getTracks().forEach((track) => track.stop())
  },
}
