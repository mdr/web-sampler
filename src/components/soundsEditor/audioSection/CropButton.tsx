import { mdiArrowCollapseHorizontal } from '@mdi/js'

import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { SoundId } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

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
