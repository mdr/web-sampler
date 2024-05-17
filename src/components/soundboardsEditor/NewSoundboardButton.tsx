import { mdiPlus } from '@mdi/js'
import { useSoundActions } from '../../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundboardRoute } from '../router.tsx'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewSoundboardButtonProps {
  testId?: TestId
}

export const NewSoundboardButton = ({ testId }: NewSoundboardButtonProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const soundboard = soundActions.newSoundboard()
    navigate(editSoundboardRoute(soundboard.id))
  }
  return (
    <Button
      variant={ButtonVariant.PRIMARY}
      testId={testId}
      icon={mdiPlus}
      label="New Soundboard"
      onPress={handlePress}
    />
  )
}
