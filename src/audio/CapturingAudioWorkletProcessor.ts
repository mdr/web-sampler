import { CAPTURING_AUDIO_WORKLET_NAME, STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'

class CapturingAudioWorkletProcessor extends AudioWorkletProcessor {
  private active: boolean = true

  constructor() {
    super()
    this.port.onmessage = (event) => {
      if (event.data === STOP_MESSAGE) {
        this.active = false
      }
    }
  }

  process(inputs: Float32Array[][]): boolean {
    if (!this.active) {
      return false
    }
    const inputChannelData = inputs.at(0)?.at(0)
    if (inputChannelData !== undefined) {
      this.port.postMessage(inputChannelData)
    }
    return true
  }
}

registerProcessor(CAPTURING_AUDIO_WORKLET_NAME, CapturingAudioWorkletProcessor)
