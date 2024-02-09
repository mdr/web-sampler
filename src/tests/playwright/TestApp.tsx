import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { LazyAudioContextProvider } from '../../audio/AudioContextProvider.ts'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const mockAudioRecorder = new MockAudioRecorder()
  const audioContextProvider = new LazyAudioContextProvider()
  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = new DefaultWindowTestHooks(mockAudioRecorder, clock)
    return () => clock.uninstall()
  })
  return <App audioRecorder={mockAudioRecorder} audioContextProvider={audioContextProvider} />
}
