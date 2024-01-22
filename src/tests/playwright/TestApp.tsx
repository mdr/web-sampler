import { mockAudioRecorderFactory } from './mocks/MockAudioRecorder.ts'
import { App } from '../../components/App.tsx'

export const TestApp = () => <App audioRecorderFactory={mockAudioRecorderFactory} />
