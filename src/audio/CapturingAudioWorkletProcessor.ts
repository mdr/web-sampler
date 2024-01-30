class CapturingAudioWorkletProcessor extends AudioWorkletProcessor {
  private active: boolean = true

  constructor() {
    super()
    this.port.onmessage = (event) => {
      if (event.data === 'stop') {
        this.active = false
      }
    }
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    console.log('CapturingAudioWorkletProcessor.process')
    if (!this.active) {
      return false
    }
    const input = inputs[0]
    const inputChannelData = input[0]
    if (inputChannelData !== undefined) {
      const output = outputs[0]
      output[0].set(inputChannelData)
      this.port.postMessage(inputChannelData)
    }
    return true
  }
}

registerProcessor('CapturingAudioWorkletProcessor', CapturingAudioWorkletProcessor)
