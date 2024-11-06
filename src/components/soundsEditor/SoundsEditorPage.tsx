import { FC } from 'react'

import { useIsLoading, useSounds } from '../../sounds/library/soundHooks.ts'
import { useSoundIdParam } from '../routeHooks.ts'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './editSoundPane/EditSoundPane.tsx'

export const SoundsEditorPage: FC = () => {
  const soundId = useSoundIdParam()
  const sounds = useSounds()
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  return (
    <SoundsEditorPageLayout>
      {soundId === undefined ? (
        sounds.length === 0 ? (
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
