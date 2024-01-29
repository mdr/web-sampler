import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { fetchBlob } from './testData/testBlob.ts'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  window.testHooks = {
    setVolume: async (volume: number): Promise<void> => {
      audioRecorder.volume = volume
    },
    completeRecording: async (): Promise<void> => {
      const blob = await fetchBlob()
      audioRecorder.fireRecordingCompleteListeners(blob)
    },
  }
  return <App audioRecorder={audioRecorder} />
}
