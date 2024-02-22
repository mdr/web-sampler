import { useSounds } from '../../sounds/soundHooks.ts'
import { SoundButton } from './SoundButton.tsx'

export const SoundboardPage = () => {
  const sounds = useSounds()
  return (
    <div className="grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))] gap-4 p-4">
      {sounds.map((sound) => (
        <SoundButton key={sound.id} sound={sound} />
      ))}
    </div>
  )
}
