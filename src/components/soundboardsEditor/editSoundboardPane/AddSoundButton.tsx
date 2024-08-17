import { mdiViewGridPlusOutline } from '@mdi/js'
import { DialogTrigger } from 'react-aria-components'

import { SoundboardId } from '../../../types/Soundboard.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { ChooseSoundDialog } from './ChooseSoundDialog.tsx'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'

export interface AddSoundButtonProps {
  soundboardId: SoundboardId
}

export const AddSoundButton = ({ soundboardId }: AddSoundButtonProps) => (
  <DialogTrigger>
    <Button
      variant={ButtonVariant.PRIMARY}
      testId={EditSoundboardPaneTestIds.addSoundButton}
      icon={mdiViewGridPlusOutline}
      label="Add Sound"
    />
    <Modal>
      <ChooseSoundDialog soundboardId={soundboardId} />
    </Modal>
  </DialogTrigger>
)
