enum AudioRecorderStateType {
  INACTIVE = 'INACTIVE',
  RECORDING = 'RECORDING',
}

interface InactiveAudioRecorderState {
  type: AudioRecorderStateType.INACTIVE
}

interface RecordingAudioRecorderState {
  type: AudioRecorderStateType.RECORDING
  mediaRecorder: MediaRecorder
  audioChunks: Blob[]
}

export type AudioRecorderState = InactiveAudioRecorderState | RecordingAudioRecorderState

export class AudioRecorder {
  // private state: AudioRecorderState = { type: AudioRecorderStateType.INACTIVE }
  private mediaRecorder: MediaRecorder | undefined = undefined
  private audioChunks: Blob[] = []

  startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true })
      stream.addEventListener('inactive', () => {
        console.log('Stream inactive')
        this.mediaRecorder?.stop()
      })
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const destination = audioContext.createMediaStreamDestination()
      source.connect(destination)
      this.mediaRecorder = new MediaRecorder(destination.stream)
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        console.log('Data available', event)
        this.audioChunks.push(event.data)
      }
      this.mediaRecorder.onstop = () => {
        console.log('Stopped recording')
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType })
        console.log(audioBlob)
        this.audioChunks = []
      }
      this.mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing audio device:', error)
      throw error
    }
  }

  // this.mediaRecorder.stop()
}
