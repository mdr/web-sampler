import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { Button } from 'react-aria-components'
import { useSoundActions } from '../../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../router.tsx'

import { TestId } from '../../utils/types/brandedTypes.ts'

export interface NewSoundButtonProps {
  testId: TestId
}

export const NewSoundButton = ({ testId }: NewSoundButtonProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const handlePress = () => {
    const sound = soundActions.newSound()
    navigate(editSoundRoute(sound.id))
  }
  return (
    <Button
      data-testid={testId}
      className="flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 active:bg-blue-800"
      onPress={handlePress}
    >
      <Icon className="mr-2 h-4 w-4" path={mdiPlus} size={1} />
      New Sound
    </Button>
  )
}
