import { useIsLoading, useSoundboards } from '../../sounds/soundHooks.ts'
import React from 'react'
import { useSoundboardIdParam } from '../router.tsx'
import { SoundboardsEditorPageLayout } from './SoundboardsEditorPageLayout.tsx'
import { NoSoundboardsMessage } from './NoSoundboardsMessage.tsx'
import { EditOrCreateSoundboardMessage } from './EditOrCreateSoundboardMessage.tsx'
import { EditSoundboardPane } from './editSoundboardPane/EditSoundboardPane.tsx'

export const SoundboardsEditorPage: React.FC = () => {
  const soundboardId = useSoundboardIdParam()
  const soundboards = useSoundboards()
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  return (
    <SoundboardsEditorPageLayout>
      {soundboardId === undefined ? (
        soundboards.length === 0 ? (
          <NoSoundboardsMessage />
        ) : (
          <EditOrCreateSoundboardMessage />
        )
      ) : (
        <EditSoundboardPane soundboardId={soundboardId} />
      )}
    </SoundboardsEditorPageLayout>
  )
}
