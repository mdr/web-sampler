import { mdiTrashCan } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'

interface DeleteButtonProps {
  onPress(): void
}

export const DeleteButton = ({ onPress }: DeleteButtonProps) => (
  <Button
    testId={EditSoundPaneTestIds.deleteButton}
    variant={ButtonVariant.DANGEROUS}
    icon={mdiTrashCan}
    label="Delete"
    onPress={onPress}
  />
)
