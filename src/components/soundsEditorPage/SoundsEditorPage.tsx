import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './EditSoundPane.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { useSounds } from '../../sounds/soundHooks.ts'
import { useSoundIdParam } from '../router.tsx'

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
