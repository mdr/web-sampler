import Icon from '@mdi/react'
import { mdiTrashCan } from '@mdi/js'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

interface DeleteButtonProps {
  onPress(): void
}

export const DeleteButton = ({ onPress }: DeleteButtonProps) => (
  <button
    data-testid={EditSoundPaneTestIds.deleteButton}
    className="bg-red-500 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring focus:ring-red-300 text-white font-bold py-2 px-4 rounded disabled:bg-pink-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onClick={onPress}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiTrashCan} size={1} />
    Delete
  </button>
)