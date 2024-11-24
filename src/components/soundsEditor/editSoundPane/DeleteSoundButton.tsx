import { mdiTrashCan } from '@mdi/js'
import { toast } from 'react-toastify'

import { useSound, useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { SoundId, getSoundDisplayName } from '../../../types/Sound.ts'
import { useNavigate } from '../../../utils/hooks/useNavigate.ts'
import { Routes } from '../../app/routes.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

interface DeleteSoundButtonProps {
  soundId: SoundId
}

export const DeleteSoundButton = ({ soundId }: DeleteSoundButtonProps) => {
  const sound = useSound(soundId)
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const onPress = () => {
    soundActions.deleteSound(soundId)
    navigate(Routes.sounds)
    toast.info(`Deleted sound ${getSoundDisplayName(sound)}`)
  }
  return (
    <Button
      testId={EditSoundPaneTestIds.deleteButton}
      variant={ButtonVariant.DANGEROUS}
      icon={mdiTrashCan}
      label="Delete"
      onPress={onPress}
    />
  )
}
