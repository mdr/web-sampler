import audioBufferToWav from 'audiobuffer-to-wav'

export class AudioBufferUtils {
  constructor(private readonly audioContext: AudioContext) {}

  float32ArrayToAudioBuffer = (audioData: Float32Array): AudioBuffer => {
    const audioBuffer = this.audioContext.createBuffer(1, audioData.length, this.audioContext.sampleRate)
    const channelData = audioBuffer.getChannelData(0)
    channelData.set(audioData)
    return audioBuffer
  }

  float32ArrayToWavBlob = (audio: Float32Array): Blob => {
    const audioBuffer = this.float32ArrayToAudioBuffer(audio)
    const wavBuffer = audioBufferToWav(audioBuffer)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }
}
