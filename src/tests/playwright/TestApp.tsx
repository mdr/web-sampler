import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { fetchBlob } from './testData/testBlob.ts'
import FakeTimers from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = {
      setVolume: async (volume: number): Promise<void> => {
        audioRecorder.volume = volume
      },
      completeRecording: async (): Promise<void> => {
        const blob = await fetchBlob()
        audioRecorder.fireRecordingCompleteListeners(blob)
      },
      clockNext: () => clock.next(),
      clockTick: (millis: number): void => {
        clock.tick(millis)
      },
    }
  })
  return <App audioRecorder={audioRecorder} />
}
