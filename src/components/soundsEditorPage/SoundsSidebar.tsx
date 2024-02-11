import { useSoundActions, useSounds } from '../../sounds/soundHooks.ts'
import { Link, useParams } from 'react-router-dom'
import { NewSoundButton } from './NewSoundButton.tsx'
import { getDisplayName, sortSoundsByDisplayName } from '../../types/Sound.ts'
import { SoundSidebarTestIds } from './EditSoundPaneTestIds.ts'
import { Button } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiTrashCan } from '@mdi/js'

export const SoundsSidebar = () => {
  const sounds = sortSoundsByDisplayName(useSounds())
  const soundActions = useSoundActions()
  const { soundId: selectedSoundId } = useParams()
  return (
    <div data-testid={SoundSidebarTestIds.sidebar} className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ul>
          {sounds.map((sound) => (
            <li
              key={sound.id}
              className={`group relative hover:bg-blue-100 ${sound.id === selectedSoundId ? 'bg-blue-200' : ''}`}
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
                  onPress={() => soundActions.deleteSound(sound.id)}
                >
                  <Icon path={mdiTrashCan} size={1} />
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
