import { mdiTrashCan } from '@mdi/js'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { Button, ButtonVariant } from '../shared/Button.tsx'

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
