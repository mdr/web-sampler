import { useSounds } from '../../../sounds/soundHooks.ts'
import { Link } from 'react-router-dom'
import { NewSoundButton } from '../NewSoundButton.tsx'
import { getDisplayName, sortSoundsByDisplayName } from '../../../types/Sound.ts'
import { useSoundIdParam } from '../../router.tsx'
import { SoundSidebarTestIds } from './SoundSidebarTestIds.ts'

export const SoundsSidebar = () => {
  const currentSoundId = useSoundIdParam()
  const sounds = sortSoundsByDisplayName(useSounds())
  return (
    <div data-testid={SoundSidebarTestIds.sidebar} className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <ul>
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className={`group relative hover:bg-blue-100 ${sound.id === currentSoundId ? 'bg-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <Link
                  to={`/sound/${sound.id}`}
                  className="block w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  draggable={false}
                  data-testid={SoundSidebarTestIds.soundName}
                >
                  {getDisplayName(sound)}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center px-4 py-4">
        <NewSoundButton testId={SoundSidebarTestIds.newSoundButton} />
      </div>
    </div>
  )
}
