import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { castPartial, MockAudioElement } from './mocks/MockAudioElement.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'

const makeTestAppConfig = (audioRecorder: MockAudioRecorder, mockAudioElement: MockAudioElement): AppConfig =>
  makeAppConfig(audioRecorder, castPartial<HTMLAudioElement>(mockAudioElement))

export const TestApp = () => {
  const audioRecorder = new MockAudioRecorder()
  const mockAudioElement = new MockAudioElement()
  const config = makeTestAppConfig(audioRecorder, mockAudioElement)

  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = new DefaultWindowTestHooks(audioRecorder, mockAudioElement, clock, config.soundLibrary)
    return () => clock.uninstall()
  })
  return <App config={config} />
}
