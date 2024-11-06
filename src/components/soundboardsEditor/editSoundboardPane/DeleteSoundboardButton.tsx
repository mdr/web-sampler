import { mdiTrashCan } from '@mdi/js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useSoundboard, useSoundboardActions } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId, getSoundboardDisplayName } from '../../../types/Soundboard.ts'
import { Routes } from '../../app/routes.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'

interface DeleteSoundboardButtonProps {
  soundboardId: SoundboardId
}

export const DeleteSoundboardButton = ({ soundboardId }: DeleteSoundboardButtonProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundboardActions = useSoundboardActions()
  const navigate = useNavigate()
  const onPress = () => {
    soundboardActions.deleteSoundboard(soundboardId)
    navigate(Routes.soundboards)
    toast.info(`Deleted soundboard ${getSoundboardDisplayName(soundboard)}`)
  }
  return (
    <Button
      testId={EditSoundboardPaneTestIds.deleteButton}
      variant={ButtonVariant.DANGEROUS}
      icon={mdiTrashCan}
      label="Delete"
      onPress={onPress}
    />
  )
}
