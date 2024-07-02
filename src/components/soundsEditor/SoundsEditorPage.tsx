import { SoundsEditorPageLayout } from './SoundsEditorPageLayout.tsx'
import { EditSoundPane } from './editSoundPane/EditSoundPane.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'
import { useIsLoading, useSounds } from '../../sounds/library/soundHooks.ts'
import React from 'react'
import { useSoundIdParam } from '../routeHooks.ts'

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
        <EditSoundPane key={soundId} soundId={soundId} />
      )}
    </SoundsEditorPageLayout>
  )
}
