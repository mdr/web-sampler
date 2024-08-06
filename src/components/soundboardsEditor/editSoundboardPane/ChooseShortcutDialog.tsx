import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Dialog, Heading } from 'react-aria-components'
import { Button } from '../../shared/Button.tsx'
import { useRecordHotkeys } from 'react-hotkeys-hook'

export const ChooseShortcutDialog = () => {
  const [keys, { start, stop, isRecording }] = useRecordHotkeys()

  return (
    <Dialog data-testid={EditSoundboardPaneTestIds.chooseShortcutDialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Shortcut
            </Heading>
            <p>Is recording: {isRecording ? 'yes' : 'no'}</p>
            <p>Recorded keys: {Array.from(keys).join(' + ')}</p>
            <div className="mt-6 flex justify-end space-x-2">
              <Button label={isRecording ? 'Stop recording' : 'Record'} onPress={isRecording ? stop : start} />
              <Button label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
