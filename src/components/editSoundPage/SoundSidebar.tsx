import { useSoundActions, useSounds } from '../../sounds/soundHooks.ts'
import { Link, useNavigate } from 'react-router-dom'
import { NewSoundButton } from '../homePage/NewSoundButton.tsx'
import { editSoundRoute } from '../router.tsx'
import { Sound } from '../../types/Sound.ts'

const displayName = (sound: Sound) => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)

export const SoundSidebar = () => {
  const sounds = useSounds() // Fetch sounds using the custom hook
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const handleNewSound = () => {
    const sound = soundActions.newSound()
    navigate(editSoundRoute(sound.id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ul>
          {sounds.map((sound) => (
            <li key={sound.id} className="hover:bg-gray-100">
              <Link to={`/sound/${sound.id}`} className="block w-full p-2" draggable={false}>
                {displayName(sound)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto py-4 flex justify-center">
        <NewSoundButton onPress={handleNewSound} />
      </div>
    </div>
  )
}
