import { AudioOperations } from '../audioOperations/AudioOperations.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { SoundLibrary } from '../sounds/library/SoundLibrary.ts'
import { AppDb } from '../sounds/store/AppDb.ts'
import { DexieSoundStore } from '../sounds/store/DexieSoundStore.ts'
import { StorageManager } from '../storage/StorageManager.tsx'

export interface AppConfig {
  audioRecorder: AudioRecorder
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
  storageManager: StorageManager
  audioOperations: AudioOperations
}

export const makeAppConfig = (
  audioRecorder: AudioRecorder,
  audioElement: HTMLAudioElement,
  storageManager: StorageManager,
  audioOperations: AudioOperations,
): AppConfig => {
  const audioPlayer = new DefaultAudioPlayer(audioElement)
  const soundLibrary = new SoundLibrary(new DexieSoundStore(new AppDb()))
  return { audioRecorder, audioPlayer, soundLibrary, storageManager, audioOperations }
}
