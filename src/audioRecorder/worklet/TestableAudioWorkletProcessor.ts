// Allow for more straightforward unit testing by extracting the core of an AudioWorkletProcessor behaviour.
export interface AudioWorkletProcessorImplementation {
  initialize: (port: MessagePort) => void
  process: (
    messagePort: MessagePort,
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ) => boolean
}

export class TestableAudioWorkletProcessor extends AudioWorkletProcessor {
  constructor(private readonly implementation: AudioWorkletProcessorImplementation) {
    super()
    implementation.initialize(this.port)
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean {
    return this.implementation.process(this.port, inputs, outputs, parameters)
  }
}
