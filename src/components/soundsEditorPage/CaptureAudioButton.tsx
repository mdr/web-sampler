import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiMonitorSpeaker } from '@mdi/js'
import { Button, ButtonVariant } from '../shared/Button.tsx'

interface CaptureAudioButtonProps {
  onPress(): void
}

export const CaptureAudioButton = ({ onPress }: CaptureAudioButtonProps) => (
  <Button
    testId={EditSoundPaneTestIds.captureAudioButton}
    variant={ButtonVariant.DANGEROUS}
    icon={mdiMonitorSpeaker}
    label="Capture Audio"
    onPress={onPress}
  />
)
