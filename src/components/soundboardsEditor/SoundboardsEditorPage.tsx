import { useIsLoading, useSoundboards } from '../../sounds/library/soundHooks.ts'
import React from 'react'
import { SoundboardsEditorPageLayout } from './SoundboardsEditorPageLayout.tsx'
import { NoSoundboardsMessage } from './NoSoundboardsMessage.tsx'
import { EditOrCreateSoundboardMessage } from './EditOrCreateSoundboardMessage.tsx'
import { EditSoundboardPane } from './editSoundboardPane/EditSoundboardPane.tsx'
import { useSoundboardIdParam } from '../routeHooks.ts'

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
        <EditSoundboardPane key={soundboardId} soundboardId={soundboardId} />
      )}
    </SoundboardsEditorPageLayout>
  )
}
