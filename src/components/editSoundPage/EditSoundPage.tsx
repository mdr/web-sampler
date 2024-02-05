import { useParams } from 'react-router-dom'
import { SoundId } from '../../types/Sound.ts'
import { useMaybeSound } from '../../sounds/soundHooks.ts'
import { EditSoundPageContents } from './EditSoundPageContents.tsx'
import { Navbar } from '../shared/Navbar.tsx'
import { SoundNotFound } from './SoundNotFound.tsx'
import { SoundSidebar } from './SoundSidebar.tsx'

const useSoundIdParam = (): SoundId => {
  const { soundId } = useParams()
  if (soundId === undefined) {
    throw new Error('soundId route param was expected but not found')
  }
  return SoundId(soundId)
}

export const EditSoundPage = () => {
  const soundId = useSoundIdParam()
  const sound = useMaybeSound(soundId)
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64 flex-none">
          <SoundSidebar />
        </div>
        <div className="flex-grow border-l border-gray-200">
          {sound === undefined ? <SoundNotFound /> : <EditSoundPageContents soundId={sound.id} />}
        </div>
      </div>
    </div>
  )
}
