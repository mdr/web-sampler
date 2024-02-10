import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import { TestApp } from './tests/playwright/TestApp.tsx'
import { WebAudioRecorder } from './audio/WebAudioRecorder.ts'
import { LazyAudioContextProvider } from './audio/AudioContextProvider.ts'
import 'react-toastify/dist/ReactToastify.css'
import './main.css'

const audioContextProvider = new LazyAudioContextProvider()
const audioRecorder = new WebAudioRecorder(audioContextProvider)

const getDocumentRoot = (): HTMLElement => {
  const root = document.getElementById('root') ?? undefined
  if (root === undefined) {
    throw new Error('Root element not found')
  }
  return root
}

const USE_TEST_APP = false

ReactDOM.createRoot(getDocumentRoot()).render(
  USE_TEST_APP ? <TestApp /> : <App audioRecorder={audioRecorder} audioContextProvider={audioContextProvider} />,
)
