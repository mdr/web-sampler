import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { ActualSystemDetector } from '../../storage/ActualSystemDetector.ts'
import { BrowserPermissionManager } from '../../storage/BrowserPermissionManager.ts'
import { BrowserPersistentStorageManager } from '../../storage/BrowserPersistentStorageManager.ts'
import { StorageService } from '../../storage/StorageService.ts'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const webAudioRecorder = new WebAudioRecorder(audioContextProvider)
  const audio = new Audio()
  const storageManager = new StorageService(
    new BrowserPersistentStorageManager(),
    new BrowserPermissionManager(),
    new ActualSystemDetector(),
  )
  return makeAppConfig(webAudioRecorder, audio, storageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
