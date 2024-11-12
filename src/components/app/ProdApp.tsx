import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { BrowserPersistentStorageManager } from '../../storage/BrowserPersistentStorageManager.ts'
import { BrowserPermissionManager } from '../../storage/PermissionManager.ts'
import { StorageService } from '../../storage/StorageService.ts'
import { BowserSystemDetector } from '../../storage/SystemDetector.ts'
import { ReactToastifyToastManager } from '../../storage/ToastManager.ts'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const webAudioRecorder = new WebAudioRecorder(audioContextProvider)
  const audio = new Audio()
  const storageManager = new StorageService(
    new BrowserPersistentStorageManager(),
    new BrowserPermissionManager(),
    new BowserSystemDetector(),
    new ReactToastifyToastManager(),
  )
  return makeAppConfig(webAudioRecorder, audio, storageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
