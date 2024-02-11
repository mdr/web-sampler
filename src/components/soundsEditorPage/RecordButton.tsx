import Icon from '@mdi/react'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiMonitorSpeaker } from '@mdi/js'
import { Button } from 'react-aria-components'

interface RecordButtonProps {
  onPress(): void
}

export const RecordButton = ({ onPress }: RecordButtonProps) => (
  <Button
    data-testid={EditSoundPaneTestIds.recordButton}
    className="bg-red-500 hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring focus:ring-red-300 text-white font-bold py-2 px-4 rounded disabled:bg-pink-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onPress={onPress}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiMonitorSpeaker} size={1} />
    Record
  </Button>
)
