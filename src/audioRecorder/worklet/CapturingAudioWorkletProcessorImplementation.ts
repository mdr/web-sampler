import { STOP_MESSAGE } from './CapturingAudioWorkletConstants.ts'
import { AudioWorkletProcessorImplementation } from './TestableAudioWorkletProcessor.ts'

export class CapturingAudioWorkletProcessorImplementation implements AudioWorkletProcessorImplementation {
  private active: boolean = true

  initialize = (port: MessagePort): void => {
    port.onmessage = (event) => {
      if (event.data === STOP_MESSAGE) {
        this.active = false
      }
    }
  }

  process = (port: MessagePort, inputs: Float32Array[][]): boolean => {
    if (!this.active) {
      return false
    }
    const input = inputs.at(0)
    const channel = input?.at(0)
    if (channel !== undefined) {
      // We sometimes get sent samples slightly outside the [-1, 1] range, e.g. -1.000229835510254
      // (A video that exhibits this behaviour is: https://www.youtube.com/watch?v=uelA7KRLINA)
      // To avoid this, we clamp the samples.
      // Docs: https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletProcessor/process#inputs
      const clampedData = channel.map(clampSample)
      port.postMessage(clampedData)
    }
    return true
  }
}

const clampSample = (sample: number): number => Math.min(1.0, Math.max(-1.0, sample))
