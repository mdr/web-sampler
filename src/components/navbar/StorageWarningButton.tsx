import { DialogTrigger } from 'react-aria-components'
import { mdiAlert } from '@mdi/js'
import { StorageWarningDialog } from './StorageWarningDialog.tsx'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { NavbarIconButton } from './NavbarIconButton.tsx'
import { Modal } from '../shared/Modal.tsx'

export const StorageWarningButton = () => (
  <DialogTrigger>
    <NavbarIconButton label="Storage Warning" icon={mdiAlert} testId={NavbarTestIds.storageWarningButton} />
    <Modal>
      <StorageWarningDialog />
    </Modal>
  </DialogTrigger>
)
