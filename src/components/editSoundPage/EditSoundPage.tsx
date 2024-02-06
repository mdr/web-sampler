import { useParams } from 'react-router-dom'
import { SoundId } from '../../types/Sound.ts'
import { SoundSidebarPageLayout } from '../shared/SoundSidebarPageLayout.tsx'
import { EditSoundPane } from './EditSoundPane.tsx'
import { Option } from '../../utils/types/Option.ts'
import { NoSoundsMessage } from '../homePage/NoSoundsMessage.tsx'
import { EditOrCreateSoundMessage } from '../homePage/EditOrCreateSoundMessage.tsx'
import { useSounds } from '../../sounds/soundHooks.ts'

const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}

export const EditSoundPage = () => {
  const soundId = useSoundIdParam()
  const sounds = useSounds()

  return (
    <SoundSidebarPageLayout>
      {soundId === undefined ? (
        sounds.length === 0 ? (
          <NoSoundsMessage />
        ) : (
          <EditOrCreateSoundMessage />
        )
      ) : (
        <EditSoundPane soundId={soundId} />
      )}
    </SoundSidebarPageLayout>
  )
}
