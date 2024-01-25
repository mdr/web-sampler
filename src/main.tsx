import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import './main.css'
import { AudioRecorder } from './audio/AudioRecorder.ts'

const audioRecorder = new AudioRecorder(new AudioContext())
ReactDOM.createRoot(document.getElementById('root')!).render(<App audioRecorder={audioRecorder} />)
