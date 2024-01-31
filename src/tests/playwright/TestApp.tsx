import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './DefaultWindowTestHooks.tsx'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = new DefaultWindowTestHooks(audioRecorder, clock)
    return () => clock.uninstall()
  })
  return <App audioRecorder={audioRecorder} />
}
