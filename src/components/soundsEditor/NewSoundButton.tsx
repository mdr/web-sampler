import { mdiPlus } from '@mdi/js'
import { useSoundActions } from '../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'
import { editSoundRoute } from '../routes.ts'

export interface NewSoundButtonProps {
  testId?: TestId
}

export const NewSoundButton = ({ testId }: NewSoundButtonProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const sound = soundActions.newSound()
    navigate(editSoundRoute(sound.id))
  }
  return (
    <Button variant={ButtonVariant.PRIMARY} testId={testId} icon={mdiPlus} label="New Sound" onPress={handlePress} />
  )
}
