import { TestId } from '../../utils/types/brandedTypes.ts'

export const EditSoundPaneTestIds = {
  soundNameInput: TestId('EditSoundPane.soundNameInput'),
  captureAudioButton: TestId('EditSoundPane.captureAudioButton'),
  downloadWavButton: TestId('EditSoundPane.downloadWavButton'),
  cropButton: TestId('EditSoundPane.cropButton'),
  stopButton: TestId('EditSoundPane.stopButton'),
  deleteButton: TestId('EditSoundPane.deleteButton'),
  volumeMeter: TestId('EditSoundPane.volumeMeter'),
  playButton: TestId('EditSoundPane.playButton'),
  pauseButton: TestId('EditSoundPane.pauseButton'),
  waveformCanvas: TestId('EditSoundPane.waveformCanvas'),
}

export const NoSoundsMessageTestIds = {
  newSoundButton: TestId('NoSoundsMessage.newSoundButton'),
}

export const SoundSidebarTestIds = {
  sidebar: TestId('SoundsEditorPage.sidebar'),
  newSoundButton: TestId('SoundSidebar.newSoundButton'),
  soundName: TestId('SoundSidebar.soundName'),
}
