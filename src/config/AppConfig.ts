import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { SoundLibrary } from '../sounds/library/SoundLibrary.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { DexieSoundStore } from '../sounds/store/DexieSoundStore.ts'
import { AppDb } from '../sounds/store/AppDb.ts'
import { StorageManager } from '../storage/StorageManager.tsx'
import { AudioOperations } from '../audioOperations/AudioOperations.ts'

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
