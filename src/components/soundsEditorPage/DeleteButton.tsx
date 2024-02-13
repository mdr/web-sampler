import Icon from '@mdi/react'
import { mdiTrashCan } from '@mdi/js'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { Button } from 'react-aria-components'

interface DeleteButtonProps {
  onPress(): void
}

export const DeleteButton = ({ onPress }: DeleteButtonProps) => (
  <Button
    data-testid={EditSoundPaneTestIds.deleteButton}
    className="flex items-center justify-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 active:bg-red-800"
    onPress={onPress}
  >
    <Icon className="mr-2 h-4 w-4" path={mdiTrashCan} size={1} />
    Delete
  </Button>
)
