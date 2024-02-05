import { Navbar } from '../shared/Navbar.tsx'
import { NewSoundButton } from './NewSoundButton.tsx'
import { useSoundActions } from '../../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../router.tsx'

export const HomePage = () => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const handleNewSound = () => {
    const sound = soundActions.newSound()
    navigate(editSoundRoute(sound.id))
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <NewSoundButton onPress={handleNewSound} />
      </div>
    </>
  )
}
