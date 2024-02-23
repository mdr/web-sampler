import { useSounds } from '../../sounds/soundHooks.ts'
import { SoundButton } from './SoundButton.tsx'
import { sortSoundsByDisplayName } from '../../types/Sound.ts'

export const SoundboardPage = () => {
  const sounds = sortSoundsByDisplayName(useSounds()).filter((sound) => sound.audio !== undefined)
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 p-4">
      {sounds.map((sound, i) => (
        <SoundButton key={sound.id} hotkey={i + 1 + ''} sound={sound} />
      ))}
    </div>
  )
}
