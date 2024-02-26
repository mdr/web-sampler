import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './EditSoundPane.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { useIsLoading, useSounds } from '../../sounds/soundHooks.ts'
import { useSoundIdParam } from '../router.tsx'
import React from 'react'

export const SoundsEditorPage: React.FC = () => {
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
        <EditSoundPane soundId={soundId} />
      )}
    </SoundsEditorPageLayout>
  )
}
