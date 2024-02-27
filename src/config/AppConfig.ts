import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { SoundStore } from '../sounds/SoundStore.ts'
import { AppDb } from '../sounds/AppDb.ts'

export interface AppConfig {
  audioRecorder: AudioRecorder
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
}

export const makeAppConfig = (audioRecorder: AudioRecorder, audioElement: HTMLAudioElement): AppConfig => {
  const audioPlayer = new DefaultAudioPlayer(audioElement)
  const soundLibrary = new SoundLibrary(new SoundStore(new AppDb()))
  return { audioRecorder, audioPlayer, soundLibrary }
}
