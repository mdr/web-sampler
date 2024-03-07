import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { DexieSoundStore } from '../sounds/DexieSoundStore.ts'
import { AppDb } from '../sounds/AppDb.ts'
import { StorageManager } from '../storage/StorageManager.tsx'

export interface AppConfig {
  audioRecorder: AudioRecorder
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
  storageManager: StorageManager
}

export const makeAppConfig = (
  audioRecorder: AudioRecorder,
  audioElement: HTMLAudioElement,
  storageManager: StorageManager,
): AppConfig => {
  const audioPlayer = new DefaultAudioPlayer(audioElement)
  const soundLibrary = new SoundLibrary(new DexieSoundStore(new AppDb()))
  return { audioRecorder, audioPlayer, soundLibrary, storageManager }
}
