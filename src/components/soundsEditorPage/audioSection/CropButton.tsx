import { EditSoundPaneTestIds } from '../SoundEditorPageTestIds.ts'
import { mdiArrowCollapseHorizontal } from '@mdi/js'
import { SoundId } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { useSoundActions } from '../../../sounds/soundHooks.ts'

interface CropButtonProps {
  soundId: SoundId
}

export const CropButton = ({ soundId }: CropButtonProps) => {
  const soundActions = useSoundActions()
  const handlePress = () => soundActions.cropAudio(soundId)
  return (
    <Button
      testId={EditSoundPaneTestIds.cropAudioButton}
      icon={mdiArrowCollapseHorizontal}
      label="Crop Audio"
      onPress={handlePress}
    />
  )
}
