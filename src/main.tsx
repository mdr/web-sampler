import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import { WebAudioRecorder } from './audio/WebAudioRecorder.ts'
import { LazyAudioContextProvider } from './audio/AudioContextProvider.ts'
import 'react-toastify/dist/ReactToastify.css'
import './main.css'

const audioRecorder = new WebAudioRecorder(new LazyAudioContextProvider())

const getDocumentRoot = (): HTMLElement => {
  const root = document.getElementById('root') ?? undefined
  if (root === undefined) {
    throw new Error('Root element not found')
  }
  return root
}

ReactDOM.createRoot(getDocumentRoot()).render(<App audioRecorder={audioRecorder} />)
