import { useParams } from 'react-router-dom'
import { SoundId } from '../../types/Sound.ts'
import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './EditSoundPane.tsx'
import { Option } from '../../utils/types/Option.ts'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { useSounds } from '../../sounds/soundHooks.ts'

const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}

export const SoundsEditorPage = () => {
  const soundId = useSoundIdParam()
  const sounds = useSounds()

  return (
    <SoundsEditorPageLayout>
      {soundId === undefined ? (
        sounds.length === 0 ? (
          <NoSoundsMessage />
        ) : (
          <EditOrCreateSoundMessage />
        )
      ) : (
        <EditSoundPane soundId={soundId} />
      )}
    </SoundsEditorPageLayout>
  )
}
