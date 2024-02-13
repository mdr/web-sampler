import Icon from '@mdi/react'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiMonitorSpeaker } from '@mdi/js'
import { Button } from 'react-aria-components'

interface CaptureAudioButtonProps {
  onPress(): void
}

export const CaptureAudioButton = ({ onPress }: CaptureAudioButtonProps) => (
  <Button
    data-testid={EditSoundPaneTestIds.captureAudioButton}
    className="flex items-center justify-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 active:bg-red-800"
    onPress={onPress}
  >
    <Icon className="mr-2 h-4 w-4" path={mdiMonitorSpeaker} size={1} />
    Capture Audio
  </Button>
)
