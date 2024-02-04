import { useParams } from 'react-router-dom'
import { SoundId } from '../../types/Sound.ts'
import { useMaybeSound } from '../../sounds/soundHooks.ts'
import { EditSoundPageContents } from './EditSoundPageContents.tsx'
import { Navbar } from '../Navbar.tsx'
import { SoundNotFound } from './SoundNotFound.tsx'

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
    <>
      <Navbar />
      {sound === undefined ? <SoundNotFound /> : <EditSoundPageContents soundId={sound.id} />}
    </>
  )
}
