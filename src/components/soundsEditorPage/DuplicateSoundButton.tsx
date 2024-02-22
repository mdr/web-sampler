import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { Button } from '../shared/Button.tsx'
import { mdiContentDuplicate } from '@mdi/js'
import { SoundId } from '../../types/Sound.ts'
import { useSoundActions } from '../../sounds/soundHooks.ts'

export interface DuplicateSoundButtonProps {
  soundId: SoundId
}

export const DuplicateSoundButton = ({ soundId }: DuplicateSoundButtonProps) => {
  const soundActions = useSoundActions()
  const onPress = () => {
    soundActions.duplicateSound(soundId)
  }
  return (
    <Button
      testId={EditSoundPaneTestIds.duplicateButton}
      icon={mdiContentDuplicate}
      label="Duplicate"
      onPress={onPress}
    />
  )
}
