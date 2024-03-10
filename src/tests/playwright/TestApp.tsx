import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { castPartial, MockAudioElement } from './mocks/MockAudioElement.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { FakeStorageManager } from '../../storage/FakeStorageManager.tsx'
import { AttemptToMakeStoragePersistentResult } from '../../storage/StorageManager.tsx'

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
    const clock = useFakeTimers ? FakeTimers.install() : undefined
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
  return makeAppConfig(audioRecorder, audioElement, storageManager)
}
