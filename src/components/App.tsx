import { Navbar } from './NavBar.tsx'
import { PrimaryButton } from './PrimaryButton.tsx'
import { AudioRecorder } from '../AudioRecorder.ts'

export const App = () => {
  const sampleAudio = async () => {
    const audioRecorder = new AudioRecorder()
    await audioRecorder.startRecording()
  }
  return (
    <>
      <Navbar />
      <div className="flex items-baseline space-x-4 p-4">
        <PrimaryButton onPress={sampleAudio}>Sample</PrimaryButton>
      </div>
    </>
  )
}
