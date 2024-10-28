import { mdiPlus } from '@mdi/js'
import { useNavigate } from 'react-router-dom'

import { useSoundboardActions } from '../../sounds/library/soundHooks.ts'
import { TestId } from '../../utils/types/brandedTypes.ts'
import { editSoundboardRoute } from '../routes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewSoundboardButtonProps {
  testId?: TestId
}

export const NewSoundboardButton = ({ testId }: NewSoundboardButtonProps) => {
  const soundboardActions = useSoundboardActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const soundboard = soundboardActions.newSoundboard()
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
