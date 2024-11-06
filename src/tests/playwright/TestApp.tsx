import { default as FakeTimers, InstalledClock } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'

import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { App } from '../../components/App.tsx'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { AttemptToMakeStoragePersistentResult } from '../../storage/AttemptToMakeStoragePersistentResult.tsx'
import { FakeStorageManager } from '../../storage/FakeStorageManager.tsx'
import { MockAudioElement, castPartial } from './mocks/MockAudioElement.ts'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'

export interface TestAppProps {
  useFakeTimers?: boolean
  isStoragePersistent?: boolean
  attemptToMakeStoragePersistentResult?: AttemptToMakeStoragePersistentResult
}

export const TestApp = ({
  useFakeTimers = true,
  isStoragePersistent = false,
  attemptToMakeStoragePersistentResult = AttemptToMakeStoragePersistentResult.SUCCESSFUL,
}: TestAppProps) => {
  const audioRecorder = new MockAudioRecorder()
  const mockAudioElement = new MockAudioElement()
  const config = makeTestAppConfig(
    audioRecorder,
    mockAudioElement,
    isStoragePersistent,
    attemptToMakeStoragePersistentResult,
  )

  useDidMount(() => {
    const clock = useFakeTimers ? installFakeTimers() : undefined
    window.testHooks = new DefaultWindowTestHooks(audioRecorder, mockAudioElement, clock, config.soundLibrary)
    return () => clock?.uninstall()
  })
  return <App config={config} />
}

const makeTestAppConfig = (
  audioRecorder: MockAudioRecorder,
  mockAudioElement: MockAudioElement,
  isStoragePersistent: boolean,
  attemptToMakeStoragePersistentResult: AttemptToMakeStoragePersistentResult,
): AppConfig => {
  const storageManager = new FakeStorageManager(isStoragePersistent, attemptToMakeStoragePersistentResult)
  const audioElement = castPartial<HTMLAudioElement>(mockAudioElement)
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  return makeAppConfig(audioRecorder, audioElement, storageManager, audioOperations)
}

const installFakeTimers = (): InstalledClock =>
  FakeTimers.install({
    toFake: [
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'Date',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'performance',
    ],
  })
