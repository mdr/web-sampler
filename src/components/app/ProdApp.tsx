import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { AudioRecorderService } from '../../audioRecorder/AudioRecorderService.ts'
import workletUrl from '../../audioRecorder/worklet/CapturingAudioWorkletProcessor.ts?worker&url'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { BrowserPersistentStorageManager } from '../../storage/BrowserPersistentStorageManager.ts'
import { BrowserPermissionManager } from '../../storage/PermissionManager.ts'
import { StorageService } from '../../storage/StorageService.ts'
import { BowserSystemDetector } from '../../storage/SystemDetector.ts'
import { ReactToastifyToastManager } from '../../storage/ToastManager.ts'
import { Url } from '../../utils/types/brandedTypes.ts'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const audioRecorderService = new AudioRecorderService(audioContextProvider, Url(workletUrl))
  const audio = new Audio()
  const storageManager = new StorageService(
    new BrowserPersistentStorageManager(),
    new BrowserPermissionManager(),
    new BowserSystemDetector(),
    new ReactToastifyToastManager(),
  )
  return makeAppConfig(audioRecorderService, audio, storageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
