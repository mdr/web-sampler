import { TestId } from '../../utils/types/TestId.ts'

export const EditSoundPaneTestIds = {
  soundNameInput: TestId('SoundsEditorPage.soundNameInput'),
  recordButton: TestId('SoundsEditorPage.recordButton'),
  stopButton: TestId('SoundsEditorPage.stopButton'),
  volumeMeter: TestId('SoundsEditorPage.volumeMeter'),
  audioElement: TestId('SoundsEditorPage.audioElement'),
}

export const NoSoundsMessageTestIds = {
  newSoundButton: TestId('NoSoundsMessage.newSoundButton'),
}

export const SoundSidebarTestIds = {
  newSoundButton: TestId('SoundSidebar.newSoundButton'),
  soundName: TestId('SoundSidebar.soundName'),
}
