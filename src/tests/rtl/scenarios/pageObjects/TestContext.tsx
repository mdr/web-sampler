import { MockAudioRecorder } from '../../../playwright/mocks/MockAudioRecorder.ts'

export interface TestContext {
  audioRecorder: MockAudioRecorder
}