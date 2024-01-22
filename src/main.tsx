import ReactDOM from 'react-dom/client'
import { App } from './components/App.tsx'
import './main.css'
import { defaultAudioRecorderFactory } from './audio/AudioRecorder.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(<App audioRecorderFactory={defaultAudioRecorderFactory} />)
