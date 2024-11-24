import { useIsLoading, useSoundCount } from '../../sounds/library/soundHooks.ts'
import { useSoundIdParam } from '../app/routeHooks.ts'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './editSoundPane/EditSoundPane.tsx'

export const SoundsEditorPage = () => {
  const soundId = useSoundIdParam()
  const soundCount = useSoundCount()
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  return (
    <SoundsEditorPageLayout>
      {soundId === undefined ? (
        soundCount === 0 ? (
          <NoSoundsMessage />
        ) : (
          <EditOrCreateSoundMessage />
        )
      ) : (
        <EditSoundPane key={soundId} soundId={soundId} />
      )}
    </SoundsEditorPageLayout>
  )
}
