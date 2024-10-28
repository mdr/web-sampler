import { mdiViewGridPlusOutline } from '@mdi/js'
import { DialogTrigger } from 'react-aria-components'

import { SoundId } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { ChooseImageDialog } from './ChooseImageDialog.tsx'
import { EditImagePaneTestIds } from './EditImagePaneTestIds.ts'

export interface AddImageButtonProps {
  soundId: SoundId
}

export const AddImageButton = ({ soundId }: AddImageButtonProps) => (
  <DialogTrigger>
    <Button
      variant={ButtonVariant.PRIMARY}
      testId={EditImagePaneTestIds.addImageButton}
      icon={mdiViewGridPlusOutline}
      label="Add Image"
    />
    <Modal>
      <ChooseImageDialog soundId={soundId} />
    </Modal>
  </DialogTrigger>
)
