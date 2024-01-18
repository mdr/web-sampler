import { unawaited } from './utils.ts'

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | undefined = undefined
  private audioContext: AudioContext | undefined = undefined
  private audioChunks: Blob[] = []

  private handleStreamInactive = () => {
    console.log('Stream inactive')
    this.mediaRecorder?.stop()
  }

  private handleDataAvailable = (event: BlobEvent) => {
    console.log('Data available', event)
    this.audioChunks.push(event.data)
  }

  private handleMediaRecorderStop = () => {
    console.log('Stopped recording')
    const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType })
    console.log(audioBlob)
    this.audioChunks = []
    if (this.audioContext) {
      unawaited(this.audioContext.close())
    }
    this.audioContext = undefined
    if (this.mediaRecorder) {
      this.mediaRecorder.removeEventListener('dataavailable', this.handleDataAvailable)
      this.mediaRecorder.removeEventListener('stop', this.handleMediaRecorderStop)
    }
    this.mediaRecorder = undefined
  }

  startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true })
      stream.getAudioTracks().forEach((track) => track.stop())
      stream.addEventListener('inactive', this.handleStreamInactive)
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const destination = audioContext.createMediaStreamDestination()
      source.connect(destination)
      const mediaRecorder = new MediaRecorder(destination.stream)
      mediaRecorder.addEventListener('dataavailable', this.handleDataAvailable)
      mediaRecorder.addEventListener('stop', this.handleMediaRecorderStop)
      mediaRecorder.start()
      this.mediaRecorder = mediaRecorder
    } catch (error) {
      console.error('Error setting up recording:', error)
      throw error
    }
  }

  // this.mediaRecorder.stop()
}
