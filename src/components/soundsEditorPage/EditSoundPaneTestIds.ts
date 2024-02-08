import { TestId } from '../../utils/types/brandedTypes.ts'

export const EditSoundPaneTestIds = {
  soundNameInput: TestId('SoundsEditorPage.soundNameInput'),
  recordButton: TestId('SoundsEditorPage.recordButton'),
  stopButton: TestId('SoundsEditorPage.stopButton'),
  volumeMeter: TestId('SoundsEditorPage.volumeMeter'),
  playButton: TestId('SoundsEditorPage.playButton'),
}

export const NoSoundsMessageTestIds = {
  newSoundButton: TestId('NoSoundsMessage.newSoundButton'),
}

export const SoundSidebarTestIds = {
  newSoundButton: TestId('SoundSidebar.newSoundButton'),
  soundName: TestId('SoundSidebar.soundName'),
}
