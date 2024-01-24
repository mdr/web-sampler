import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import audioUrl from '../../assets/captured-audio-example.webm'

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

const fetchBlob = async (): Promise<Blob> => {
  const response = await fetch(audioUrl)
  if (!response.ok) {
    throw new Error('Audio file could not be loaded')
  }
  return await response.blob()
}
