import audioBufferToWav from 'audiobuffer-to-wav'

export class AudioBufferUtils {
  constructor(private readonly audioContext: AudioContext) {}

  audioBufferFromFloat32Array = (audioData: Float32Array): AudioBuffer => {
    const audioBuffer = this.createMonoAudioBuffer(audioData.length)
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(audioData)
    return audioBuffer
  }

  private createMonoAudioBuffer = (length: number): AudioBuffer =>
    this.audioContext.createBuffer(1, length, this.audioContext.sampleRate)

  float32ArrayToWavBlob = (audio: Float32Array): Blob => {
    const audioBuffer = this.audioBufferFromFloat32Array(audio)
    const wavBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }
}
