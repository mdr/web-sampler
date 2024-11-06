import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { BrowserDetector } from '../../storage/BrowserDetector.ts'
import { NavigatorStorage } from '../../storage/NavigatorStorage.ts'
import { PermissionManager } from '../../storage/PermissionManager.ts'
import { StorageManager } from '../../storage/StorageManager.ts'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const webAudioRecorder = new WebAudioRecorder(audioContextProvider)
  const audio = new Audio()
  const storageManager = new StorageManager(new NavigatorStorage(), new PermissionManager(), new BrowserDetector())
  return makeAppConfig(webAudioRecorder, audio, storageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
