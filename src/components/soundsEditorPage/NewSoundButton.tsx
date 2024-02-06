import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { Button } from 'react-aria-components'
import { useSoundActions } from '../../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../router.tsx'
import { TestId } from '../../utils/types/TestId.ts'

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
      className="bg-blue-500 text-white rounded hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 py-2 px-4 flex items-center justify-center"
      onPress={handlePress}
    >
      <Icon className="w-4 h-4 mr-2" path={mdiPlus} size={1} />
      New Sound
    </Button>
  )
}
