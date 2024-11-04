import { Link } from 'react-router-dom'

import { useSounds } from '../../../sounds/library/soundHooks.ts'
import { getSoundDisplayName, sortSoundsByDisplayName } from '../../../types/Sound.ts'
import { useSoundIdParam } from '../../routeHooks.ts'
import { Routes } from '../../routes.ts'
import { NewSoundButton } from '../NewSoundButton.tsx'
import { SoundsSidebarTestIds } from './SoundsSidebarTestIds.ts'

export const SoundsSidebar = () => {
  const currentSoundId = useSoundIdParam()
  const sounds = sortSoundsByDisplayName(useSounds())
  return (
    <div data-testid={SoundsSidebarTestIds.sidebar} className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <ul>
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className={`group relative hover:bg-blue-100 ${sound.id === currentSoundId ? 'bg-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <Link
                  to={Routes.editSound(sound.id)}
                  className="block w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  draggable={false}
                  data-testid={SoundsSidebarTestIds.soundName}
                >
                  {getSoundDisplayName(sound)}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center px-4 py-4">
        <NewSoundButton testId={SoundsSidebarTestIds.newSoundButton} />
      </div>
    </div>
  )
}
