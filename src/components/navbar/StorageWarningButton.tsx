import { mdiAlert } from '@mdi/js'
import { DialogTrigger } from 'react-aria-components'

import { Modal } from '../shared/Modal.tsx'
import { NavbarIconButton } from './NavbarIconButton.tsx'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { StorageWarningDialog } from './StorageWarningDialog.tsx'

export const StorageWarningButton = () => (
  <DialogTrigger>
    <NavbarIconButton label="Storage Warning" icon={mdiAlert} testId={NavbarTestIds.storageWarningButton} />
    <Modal>
      <StorageWarningDialog />
    </Modal>
  </DialogTrigger>
)
