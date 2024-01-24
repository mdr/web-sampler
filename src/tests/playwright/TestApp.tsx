import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { AudioRecorderStateChangeListener } from '../../audio/IAudioRecorder.ts'

export interface TestAppProps {
  onStateChange: AudioRecorderStateChangeListener
}

export const TestApp = ({ onStateChange }: TestAppProps) => {
  const audioRecorder = new MockAudioRecorder()
  window.setVolume = async (volume: number): Promise<void> => {
    audioRecorder.volume = volume
  }
  audioRecorder.addStateChangeListener(onStateChange)
  return <App audioRecorder={audioRecorder} />
}
