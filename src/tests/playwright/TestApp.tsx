import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  window.setVolume = async (volume: number): Promise<void> => {
    audioRecorder.volume = volume
  }
  return <App audioRecorder={audioRecorder} />
}
