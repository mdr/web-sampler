import { AudioOperations } from '../audioOperations/AudioOperations.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { SoundLibrary } from '../sounds/library/SoundLibrary.ts'
import { AppDb } from '../sounds/store/AppDb.ts'
import { DexieSoundStore } from '../sounds/store/DexieSoundStore.ts'
import { StorageService } from '../storage/StorageService.ts'

export interface AppConfig {
  audioRecorder: AudioRecorder
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
  storageService: StorageService
  audioOperations: AudioOperations
}

export const makeAppConfig = (
  audioRecorder: AudioRecorder,
  audioElement: HTMLAudioElement,
  storageService: StorageService,
  audioOperations: AudioOperations,
): AppConfig => {
  const audioPlayer = new DefaultAudioPlayer(audioElement)
  const soundLibrary = new SoundLibrary(new DexieSoundStore(new AppDb()))
  return { audioRecorder, audioPlayer, soundLibrary, storageService, audioOperations }
}
