import { App } from './App.tsx'
import { LazyAudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../audioRecorder/WebAudioRecorder.ts'
import { AppConfig, makeAppConfig } from '../config/AppConfig.ts'

const makeProdAppConfig = (): AppConfig =>
  makeAppConfig(new WebAudioRecorder(new LazyAudioContextProvider()), new Audio())

export const ProdApp = () => {
  const config = makeProdAppConfig()
  return <App config={config} />
}
