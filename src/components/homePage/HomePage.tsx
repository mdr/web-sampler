import { Navbar } from '../shared/Navbar.tsx'
import { NewSoundButton } from './NewSoundButton.tsx'
import { useSoundActions } from '../../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'

export const HomePage = () => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const handleNewSound = () => {
    const sound = soundActions.newSound()
    navigate(`/sound/${sound.id}`)
  }

  return (
    <>
      <Navbar />
      <div className="p-4">
        <NewSoundButton onPress={handleNewSound}>New Sound</NewSoundButton>
      </div>
    </>
  )
}
