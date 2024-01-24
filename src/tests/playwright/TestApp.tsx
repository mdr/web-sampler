import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'

export const TestApp = () => <App audioRecorder={new MockAudioRecorder()} />
