import { App } from './App.tsx'
import { LazyAudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../config/AppConfig.ts'
import { WebStorageManager } from '../storage/WebStorageManager.tsx'
import { AudioOperations } from '../audioOperations/AudioOperations.ts'

const makeProdAppConfig = (): AppConfig => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioOperations = new AudioOperations(audioContextProvider)
  return makeAppConfig(
    new WebAudioRecorder(audioContextProvider),
    new Audio(),
    new WebStorageManager(),
    audioOperations,
  )
}

export const ProdApp = () => {
  const config = makeProdAppConfig()
  return <App config={config} />
}
