import { useSoundActions, useSounds } from '../../sounds/soundHooks.ts'
import { Link, useNavigate } from 'react-router-dom'
import { NewSoundButton } from './NewSoundButton.tsx'
import { getDisplayName, sortSoundsByDisplayName, SoundId } from '../../types/Sound.ts'
import { SoundSidebarTestIds } from './EditSoundPaneTestIds.ts'
import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiTrashCan } from '@mdi/js'
import { useSoundIdParam } from '../router.tsx'

export const SoundsSidebar = () => {
  const currentSoundId = useSoundIdParam()
  const sounds = sortSoundsByDisplayName(useSounds())
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handleDeleteSound = (soundId: SoundId) => {
    if (currentSoundId === soundId) {
      navigate('/')
    }
    soundActions.deleteSound(soundId)
  }
  return (
    <div data-testid={SoundSidebarTestIds.sidebar} className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ul>
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className={`group relative hover:bg-blue-100 ${sound.id === currentSoundId ? 'bg-blue-200' : ''}`}
            >
              <div className="flex justify-between items-center">
                <Link
                  to={`/sound/${sound.id}`}
                  className="block w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  draggable={false}
                  data-testid={SoundSidebarTestIds.soundName}
                >
                  {getDisplayName(sound)}
                </Link>
                <Button
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Delete"
                  onPress={() => handleDeleteSound(sound.id)}
                >
                  <Icon path={mdiTrashCan} size={1} title="Delete" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto py-4 flex justify-center">
        <NewSoundButton testId={SoundSidebarTestIds.newSoundButton} />
      </div>
    </div>
  )
}
