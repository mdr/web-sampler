import { Navbar } from './Navbar.tsx'
import { NewSoundButton } from './NewSoundButton.tsx'
import { useSoundActions } from '../sounds/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { HomePageTestIds } from './HomePage.testIds.ts'

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
        <NewSoundButton testId={HomePageTestIds.newSoundButton} onPress={handleNewSound}>
          New Sound
        </NewSoundButton>
      </div>
    </>
  )
}
