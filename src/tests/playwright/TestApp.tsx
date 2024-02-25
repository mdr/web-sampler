import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { WebAudioPlayer } from '../../audioPlayer/WebAudioPlayer.ts'
import { castPartial, MockAudioElement } from './mocks/MockAudioElement.ts'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  const audioContextProvider = new LazyAudioContextProvider()
  const mockAudioElement = new MockAudioElement()
  const audioPlayer = new WebAudioPlayer(castPartial<HTMLAudioElement>(mockAudioElement))
  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = new DefaultWindowTestHooks(audioRecorder, mockAudioElement, clock)
    return () => clock.uninstall()
  })
  return <App audioRecorder={audioRecorder} audioContextProvider={audioContextProvider} audioPlayer={audioPlayer} />
}
