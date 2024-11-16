import { CAPTURING_AUDIO_WORKLET_NAME } from './CapturingAudioWorkletConstants.ts'
import { CapturingAudioWorkletProcessorImplementation } from './CapturingAudioWorkletProcessorImplementation.ts'
import { TestableAudioWorkletProcessor } from './TestableAudioWorkletProcessor.ts'

export class CapturingAudioWorkletProcessor extends TestableAudioWorkletProcessor {
  constructor() {
    super(new CapturingAudioWorkletProcessorImplementation())
  }
}

registerProcessor(CAPTURING_AUDIO_WORKLET_NAME, CapturingAudioWorkletProcessor)
