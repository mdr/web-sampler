import { DialogTrigger } from 'react-aria-components'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { mdiViewGridPlusOutline } from '@mdi/js'
import { Modal } from '../../shared/Modal.tsx'
import { ChooseSoundDialog } from './ChooseSoundDialog.tsx'
import { SoundboardId } from '../../../types/Soundboard.ts'

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
