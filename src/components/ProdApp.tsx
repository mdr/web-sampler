import { App } from './App.tsx'
import { LazyAudioContextProvider } from '../audioRecorder/AudioContextProvider.ts'
import { WebAudioRecorder } from '../audioRecorder/WebAudioRecorder.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { SoundStore } from '../sounds/SoundStore.ts'
import { AppDb } from '../sounds/AppDb.ts'

export const ProdApp = () => {
  const audioContextProvider = new LazyAudioContextProvider()
  const audioRecorder = new WebAudioRecorder(audioContextProvider)
  const audioPlayer = new DefaultAudioPlayer(new Audio())
  const soundLibrary = new SoundLibrary(new SoundStore(new AppDb()))

  return (
    <App
      audioRecorder={audioRecorder}
      audioContextProvider={audioContextProvider}
      audioPlayer={audioPlayer}
      soundLibrary={soundLibrary}
    />
  )
}
