import { useSounds } from '../../sounds/soundHooks.ts'
import { Link, useParams } from 'react-router-dom'
import { NewSoundButton } from './NewSoundButton.tsx'
import { getDisplayName } from '../../types/Sound.ts'
import _ from 'lodash'
import { SoundSidebarTestIds } from './EditSoundPaneTestIds.ts'

export const SoundsSidebar = () => {
  const sounds = useSounds()
  const sortedSounds = _.sortBy(sounds, (sound) => getDisplayName(sound).toLowerCase())
  const { soundId: selectedSoundId } = useParams()
  return (
    <div data-testid={SoundSidebarTestIds.sidebar} className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ul>
          {sortedSounds.map((sound) => (
            <li key={sound.id} className={`hover:bg-blue-100 ${sound.id === selectedSoundId ? 'bg-blue-200' : ''}`}>
              <Link
                to={`/sound/${sound.id}`}
                className="block w-full p-2"
                draggable={false}
                data-testid={SoundSidebarTestIds.soundName}
              >
                {getDisplayName(sound)}
              </Link>
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
