import _ from 'lodash'
import { Dialog, Heading } from 'react-aria-components'
import { useRecordHotkeys } from 'react-hotkeys-hook'

import { useSoundboard, useSoundboardActions } from '../../../sounds/library/soundHooks.ts'
import { KeyboardShortcut, describeKeyboardShortcut } from '../../../types/KeyboardShortcut.ts'
import { SoundId } from '../../../types/Sound.ts'
import { SoundboardId, getTile } from '../../../types/Soundboard.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'

export interface ChooseShortcutDialogProps {
  soundboardId: SoundboardId
  soundId: SoundId
}

export const ChooseShortcutDialog = ({ soundId, soundboardId }: ChooseShortcutDialogProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundboardActions = useSoundboardActions()
  const tile = getTile(soundboard, soundId)
  const [recordingKeySet, { start: startRecording, stop: stopRecording, isRecording }] = useRecordHotkeys()
  const recordedShortcut =
    recordingKeySet.size > 0 ? KeyboardShortcut(_.sortBy(Array.from(recordingKeySet)).join('+')) : undefined
  const handleStopRecording = () => {
    if (recordedShortcut !== undefined) {
      soundboardActions.setSoundboardTileShortcut(soundboardId, soundId, recordedShortcut)
    }
    stopRecording()
  }

  const handleClear = () => {
    soundboardActions.clearSoundboardTileShortcut(soundboardId, soundId)
  }
  return (
    <Dialog data-testid={EditSoundboardPaneTestIds.chooseShortcutDialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 pb-2 text-lg font-semibold leading-6 text-slate-700">
              Shortcut
            </Heading>
            {isRecording && (
              <>
                {recordedShortcut === undefined && <p>Press a key combination to set a shortcut</p>}
                {recordedShortcut !== undefined && <p>Recorded keys: {describeKeyboardShortcut(recordedShortcut)}</p>}
                <Button label="Stop recording" onPress={handleStopRecording} />
              </>
            )}
            {!isRecording && (
              <>
                <p>{tile.shortcut === undefined ? 'No shortcut set' : `Current shortcut: ${tile.shortcut}`}</p>
                <div className="flex space-x-2">
                  {tile.shortcut !== undefined && <Button label="Clear" onPress={handleClear} />}
                  <Button label="Record" onPress={startRecording} />
                </div>
              </>
            )}
            <div className="mt-6 flex justify-end space-x-2">
              <Button label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
