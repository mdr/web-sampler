import { useSoundActions, useSounds } from '../../../sounds/soundHooks.ts'
import { Link, useNavigate } from 'react-router-dom'
import { NewSoundButton } from '../NewSoundButton.tsx'
import { getDisplayName, sortSoundsByDisplayName, SoundId } from '../../../types/Sound.ts'
import { SoundSidebarTestIds } from '../SoundEditorPageTestIds.ts'
import * as ReactAriaComponents from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiTrashCan } from '@mdi/js'
import { useSoundIdParam } from '../../router.tsx'

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
                <ReactAriaComponents.Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform opacity-0 hover:text-blue-500 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-300 group-hover:opacity-100"
                  aria-label="Delete"
                  onPress={() => handleDeleteSound(sound.id)}
                >
                  <Icon path={mdiTrashCan} size={1} title="Delete" />
                </ReactAriaComponents.Button>
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
