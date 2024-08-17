import React from 'react'

import { useIsLoading, useSoundboards } from '../../sounds/library/soundHooks.ts'
import { useSoundboardIdParam } from '../routeHooks.ts'
import { EditOrCreateSoundboardMessage } from './EditOrCreateSoundboardMessage.tsx'
import { NoSoundboardsMessage } from './NoSoundboardsMessage.tsx'
import { SoundboardsEditorPageLayout } from './SoundboardsEditorPageLayout.tsx'
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
        <EditSoundboardPane key={soundboardId} soundboardId={soundboardId} />
      )}
    </SoundboardsEditorPageLayout>
  )
}
