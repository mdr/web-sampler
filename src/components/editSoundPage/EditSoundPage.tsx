import { useParams } from 'react-router-dom'
import { SoundId } from '../../types/Sound.ts'
import { useMaybeSound } from '../../sounds/soundHooks.ts'
import { EditSoundPane } from './EditSoundPane.tsx'
import { SoundSidebarPageLayout } from '../shared/SoundSidebarPageLayout.tsx'
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
    <SoundSidebarPageLayout>
      {sound === undefined ? (
        <div className="flex justify-center items-center h-full">
          <SoundNotFound />
        </div>
      ) : (
        <EditSoundPane soundId={sound.id} />
      )}
    </SoundSidebarPageLayout>
  )
}
