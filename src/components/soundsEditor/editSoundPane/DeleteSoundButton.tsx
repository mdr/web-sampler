import { mdiTrashCan } from '@mdi/js'

import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

interface DeleteSoundButtonProps {
  onPress(): void
}

export const DeleteSoundButton = ({ onPress }: DeleteSoundButtonProps) => (
  <Button
    testId={EditSoundPaneTestIds.deleteButton}
    variant={ButtonVariant.DANGEROUS}
    icon={mdiTrashCan}
    label="Delete"
    onPress={onPress}
  />
)
