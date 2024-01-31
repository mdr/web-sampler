import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import { AudioRecorder } from './audio/AudioRecorder.ts'
import { LazyAudioContextProvider } from './audio/AudioContextProvider.ts'
import 'react-toastify/dist/ReactToastify.css'
import './main.css'

const audioRecorder = new AudioRecorder(new LazyAudioContextProvider())

ReactDOM.createRoot(document.getElementById('root')!).render(<App audioRecorder={audioRecorder} />)
