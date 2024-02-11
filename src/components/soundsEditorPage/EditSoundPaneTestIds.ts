import { TestId } from '../../utils/types/brandedTypes.ts'

export const EditSoundPaneTestIds = {
  soundNameInput: TestId('SoundsEditorPage.soundNameInput'),
  captureButton: TestId('SoundsEditorPage.captureButton'),
  stopButton: TestId('SoundsEditorPage.stopButton'),
  deleteButton: TestId('SoundsEditorPage.deleteButton'),
  volumeMeter: TestId('SoundsEditorPage.volumeMeter'),
  playButton: TestId('SoundsEditorPage.playButton'),
  pauseButton: TestId('SoundsEditorPage.pauseButton'),
  waveformCanvas: TestId('SoundsEditorPage.waveformCanvas'),
}

export const NoSoundsMessageTestIds = {
  newSoundButton: TestId('NoSoundsMessage.newSoundButton'),
}

export const SoundSidebarTestIds = {
  sidebar: TestId('SoundsEditorPage.sidebar'),
  newSoundButton: TestId('SoundSidebar.newSoundButton'),
  soundName: TestId('SoundSidebar.soundName'),
}
