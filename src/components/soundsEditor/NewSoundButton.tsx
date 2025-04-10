import { mdiPlus } from '@mdi/js'

import { useSoundActions } from '../../sounds/library/soundHooks.ts'
import { useNavigate } from '../../utils/hooks/useNavigate.ts'
import { TestId } from '../../utils/types/brandedTypes.ts'
import { Routes } from '../app/routes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewSoundButtonProps {
  testId?: TestId
}

export const NewSoundButton = ({ testId }: NewSoundButtonProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const sound = soundActions.newSound()
    navigate(Routes.editSound(sound.id))
  }
  return (
    <Button variant={ButtonVariant.PRIMARY} testId={testId} icon={mdiPlus} label="New Sound" onPress={handlePress} />
  )
}
