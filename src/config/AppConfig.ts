import { AudioOperations } from '../audioOperations/AudioOperations.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { DefaultAudioPlayer } from '../audioPlayer/DefaultAudioPlayer.ts'
import { AudioRecorderService } from '../audioRecorder/AudioRecorderService.ts'
import { SoundLibrary } from '../sounds/library/SoundLibrary.ts'
import { AppDb } from '../sounds/store/AppDb.ts'
import { DexieSoundStore } from '../sounds/store/DexieSoundStore.ts'
import { StorageService } from '../storage/StorageService.ts'

export interface AppConfig {
  audioRecorderService: AudioRecorderService
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
  storageService: StorageService
  audioOperations: AudioOperations
}

export const makeAppConfig = (
  audioRecorderService: AudioRecorderService,
  audioElement: HTMLAudioElement,
  storageService: StorageService,
  audioOperations: AudioOperations,
): AppConfig => {
  const audioPlayer = new DefaultAudioPlayer(audioElement)
  const soundLibrary = new SoundLibrary(new DexieSoundStore(new AppDb()))
  return { audioRecorderService, audioPlayer, soundLibrary, storageService, audioOperations }
}
