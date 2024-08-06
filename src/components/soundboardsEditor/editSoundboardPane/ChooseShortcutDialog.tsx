import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Dialog, Heading } from 'react-aria-components'
import { Button } from '../../shared/Button.tsx'
import { useRecordHotkeys } from 'react-hotkeys-hook'
import { Sound } from '../../../types/Sound.ts'

export interface ChooseShortcutDialogProps {
  sound: Sound
}

export const ChooseShortcutDialog = () => {
  const [keySet, { start, stop, isRecording }] = useRecordHotkeys()
  const keys = Array.from(keySet).sort()
  return (
    <Dialog data-testid={EditSoundboardPaneTestIds.chooseShortcutDialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Shortcut
            </Heading>
            <p>Is recording: {isRecording ? 'yes' : 'no'}</p>
            <p>Recorded keys: {keys.join(' + ')}</p>
            <Button label={isRecording ? 'Stop recording' : 'Record'} onPress={isRecording ? stop : start} />
            <div className="mt-6 flex justify-end space-x-2">
              <Button label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
