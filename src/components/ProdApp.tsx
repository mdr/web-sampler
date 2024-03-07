import { App } from './App.tsx'
import { LazyAudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../config/AppConfig.ts'
import { WebStorageManager } from '../storage/WebStorageManager.tsx'

const makeProdAppConfig = (): AppConfig =>
  makeAppConfig(new WebAudioRecorder(new LazyAudioContextProvider()), new Audio(), new WebStorageManager())

export const ProdApp = () => {
  const config = makeProdAppConfig()
  return <App config={config} />
}
