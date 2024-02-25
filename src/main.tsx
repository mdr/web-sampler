import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import { TestApp } from './tests/playwright/TestApp.tsx'
import { WebAudioRecorder } from './audioRecorder/WebAudioRecorder.ts'
import { LazyAudioContextProvider } from './audioRecorder/AudioContextProvider.ts'
import { WebAudioPlayer } from './audioPlayer/WebAudioPlayer.ts'
import 'typeface-roboto'
import 'react-toastify/dist/ReactToastify.css'
import './main.css'

const audioContextProvider = new LazyAudioContextProvider()
const audioRecorder = new WebAudioRecorder(audioContextProvider)
const audioPlayer = new WebAudioPlayer(new Audio())

const getDocumentRoot = (): HTMLElement => {
  const root = document.getElementById('root') ?? undefined
  if (root === undefined) {
    throw new Error('Root element not found')
  }
  return root
}

// Set to try the TestApp (used in component tests) when running with yarn dev
const USE_TEST_APP = false

ReactDOM.createRoot(getDocumentRoot()).render(
  USE_TEST_APP ? (
    <TestApp />
  ) : (
    <App audioRecorder={audioRecorder} audioContextProvider={audioContextProvider} audioPlayer={audioPlayer} />
  ),
)
