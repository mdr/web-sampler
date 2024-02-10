import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { MockAudioPlayer } from './mocks/MockAudioPlayer.ts'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  const audioContextProvider = new LazyAudioContextProvider()
  const audioPlayer = new MockAudioPlayer()
  useDidMount(() => {
    const clock = FakeTimers.install()
    const windowTestHooks = new DefaultWindowTestHooks(audioRecorder, audioPlayer, clock)
    window.testHooks = windowTestHooks
    return () => clock.uninstall()
  })
  return <App audioRecorder={audioRecorder} audioContextProvider={audioContextProvider} audioPlayer={audioPlayer} />
}
