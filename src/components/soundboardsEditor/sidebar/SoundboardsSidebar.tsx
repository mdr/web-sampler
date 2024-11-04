import { Link } from 'react-router-dom'

import { useSoundboards } from '../../../sounds/library/soundHooks.ts'
import { getSoundboardDisplayName, sortSoundboardsByDisplayName } from '../../../types/Soundboard.ts'
import { useSoundboardIdParam } from '../../routeHooks.ts'
import { Routes } from '../../routes.ts'
import { NewSoundboardButton } from '../NewSoundboardButton.tsx'
import { SoundboardsSidebarTestIds } from './SoundboardsSidebarTestIds.ts'

export const SoundboardsSidebar = () => {
  const currentSoundboardId = useSoundboardIdParam()
  const soundboards = sortSoundboardsByDisplayName(useSoundboards())
  return (
    <div data-testid={SoundboardsSidebarTestIds.sidebar} className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <ul>
          {soundboards.map((soundboard) => (
            <li
              key={soundboard.id}
              className={`group relative hover:bg-blue-100 ${soundboard.id === currentSoundboardId ? 'bg-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <Link
                  to={Routes.editSoundboard(soundboard.id)}
                  className="block w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  draggable={false}
                  data-testid={SoundboardsSidebarTestIds.soundboardName}
                >
                  {getSoundboardDisplayName(soundboard)}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center px-4 py-4">
        <NewSoundboardButton testId={SoundboardsSidebarTestIds.newSoundboardButton} />
      </div>
    </div>
  )
}
