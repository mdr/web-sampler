import { useSounds } from '../../sounds/soundHooks.ts'
import { Link, useParams } from 'react-router-dom'
import { NewSoundButton } from './NewSoundButton.tsx'
import { Sound } from '../../types/Sound.ts'
import { SoundSidebarTestIds } from './shared.testIds.ts'
import _ from 'lodash'

const displayName = (sound: Sound) => (sound.name.trim() === '' ? 'Untitled Sound' : sound.name)

export const SoundSidebar = () => {
  const sounds = useSounds()
  const sortedSounds = _.sortBy(sounds, (sound) => displayName(sound).toLowerCase())
  const { soundId: selectedSoundId } = useParams()
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ul>
          {sortedSounds.map((sound) => (
            <li key={sound.id} className={`hover:bg-blue-100 ${sound.id === selectedSoundId ? 'bg-blue-200' : ''}`}>
              <Link
                to={`/sound/${sound.id}`}
                className="block w-full p-2"
                draggable={false}
                data-testId={SoundSidebarTestIds.soundName}
              >
                {displayName(sound)}
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
