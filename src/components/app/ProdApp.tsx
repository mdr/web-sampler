import { AudioOperations } from '../../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../../config/AppConfig.ts'
import { StorageManager } from '../../storage/StorageManager.tsx'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const webAudioRecorder = new WebAudioRecorder(audioContextProvider)
  const audio = new Audio()
  const storageManager = new StorageManager()
  return makeAppConfig(webAudioRecorder, audio, storageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
