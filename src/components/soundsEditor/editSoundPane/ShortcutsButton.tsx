import { mdiKeyboard } from '@mdi/js'
import { useContext } from 'react'
import { DialogTrigger, OverlayTriggerStateContext } from 'react-aria-components'
import { useHotkeys } from 'react-hotkeys-hook'

import { Button } from '../../shared/Button.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { ShortcutsDialog } from '../shortcutsDialog/ShortcutsDialog.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export const ShortcutsButton = () => (
  <DialogTrigger>
    <Modal>
      <ShortcutsDialog />
    </Modal>
    <ActualShortcutsButton />
  </DialogTrigger>
)

const ActualShortcutsButton = () => {
  const state = useContext(OverlayTriggerStateContext)
  useHotkeys('shift+?', () => state?.toggle())
  return <Button testId={EditSoundPaneTestIds.shortcutsButton} icon={mdiKeyboard} label="Shortcuts" />
}
