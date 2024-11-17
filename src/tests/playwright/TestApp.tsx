import useDidMount from 'beautiful-react-hooks/useDidMount'

import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { AudioRecorderService } from '../../audioRecorder/AudioRecorderService.ts'
import { App } from '../../components/app/App.tsx'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { MockPermissionManager } from '../../storage/MockPermissionManager.testSupport.ts'
import { MockPersistentStorageManager } from '../../storage/MockPersistentStorageManager.testSupport.ts'
import { StorageService } from '../../storage/StorageService.ts'
import { BowserSystemDetector } from '../../storage/SystemDetector.ts'
import { ReactToastifyToastManager } from '../../storage/ToastManager.ts'
import { MockAudioElement, castPartial } from './mocks/MockAudioElement.testSupport.ts'
import { MockAudioRecorderService } from './mocks/MockAudioRecorderService.testSupport.ts'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'

export interface TestAppProps {
  isStorageInitiallyPersistent?: boolean
  grantNotificationPermission?: boolean
  grantPersistentStorage?: boolean
}

export const TestApp = ({
  isStorageInitiallyPersistent = false,
  grantNotificationPermission = true,
  grantPersistentStorage = true,
}: TestAppProps) => {
  const audioRecorderService = new MockAudioRecorderService()
  const mockAudioElement = new MockAudioElement()
  const config = makeTestAppConfig(
    audioRecorderService,
    mockAudioElement,
    isStorageInitiallyPersistent,
    grantNotificationPermission,
    grantPersistentStorage,
  )

  useDidMount(() => {
    window.testHooks = new DefaultWindowTestHooks(audioRecorderService, mockAudioElement, config.soundLibrary)
  })
  return <App config={config} />
}

const makeTestAppConfig = (
  audioRecorderService: MockAudioRecorderService,
  mockAudioElement: MockAudioElement,
  isStorageInitiallyPersistent: boolean,
  grantNotificationPermission: boolean,
  grantPersistentStorage: boolean,
): AppConfig => {
  const persistentStorageManager = new MockPersistentStorageManager(
    isStorageInitiallyPersistent,
    grantPersistentStorage,
  )
  const permissionManager = new MockPermissionManager(grantNotificationPermission)
  const systemDetector = new BowserSystemDetector()
  const toastManager = new ReactToastifyToastManager()
  const storageService = new StorageService(persistentStorageManager, permissionManager, systemDetector, toastManager)
  const audioElement = castPartial<HTMLAudioElement>(mockAudioElement)
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  return makeAppConfig(audioRecorderService as AudioRecorderService, audioElement, storageService, audioOperations)
}
