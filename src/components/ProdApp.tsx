import { AudioOperations } from '../audioOperations/AudioOperations.ts'
import { LazyAudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../config/AppConfig.ts'
import { WebStorageManager } from '../storage/WebStorageManager.tsx'
import { App } from './App.tsx'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  const webAudioRecorder = new WebAudioRecorder(audioContextProvider)
  const audio = new Audio()
  const webStorageManager = new WebStorageManager()
  return makeAppConfig(webAudioRecorder, audio, webStorageManager, audioOperations)
}

export const ProdApp = () => <App config={makeProdAppConfig()} />
