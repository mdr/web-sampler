import { useSounds } from '../../sounds/library/soundHooks.ts'
import { sortSoundsByDisplayName, soundHasAudio } from '../../types/Sound.ts'
import { SoundButton } from './SoundButton.tsx'

export const SoundboardPage = () => {
  const sounds = sortSoundsByDisplayName(useSounds()).filter(soundHasAudio)
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_150px)] gap-4 p-4">
      {sounds.map((sound, i) => (
        <SoundButton key={sound.id} hotkey={`${i + 1}`} sound={sound} />
      ))}
    </div>
  )
}
