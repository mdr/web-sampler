import React from 'react'

import { AudioOperationsContext } from '../../audioOperations/AudioOperationsContext.ts'
import { AudioPlayerContext } from '../../audioPlayer/AudioPlayerContext.ts'
import { AudioRecorderServiceContext } from '../../audioRecorder/audioRecorderHooks.ts'
import { AppConfig } from '../../config/AppConfig.ts'
import { SoundLibraryContext } from '../../sounds/library/SoundLibraryContext.ts'
import { StorageServiceContext } from '../../storage/storageHooks.ts'

export interface AllProvidersProps {
  config: AppConfig
  children: React.ReactNode
}

export const AllProviders = ({ config, children }: AllProvidersProps) => {
  const { audioRecorderService, audioPlayer, soundLibrary, storageService, audioOperations } = config
  return (
    <AudioRecorderServiceContext.Provider value={audioRecorderService}>
      <AudioPlayerContext.Provider value={audioPlayer}>
        <AudioOperationsContext.Provider value={audioOperations}>
          <SoundLibraryContext.Provider value={soundLibrary}>
            <StorageServiceContext.Provider value={storageService}>{children}</StorageServiceContext.Provider>
          </SoundLibraryContext.Provider>
        </AudioOperationsContext.Provider>
      </AudioPlayerContext.Provider>
    </AudioRecorderServiceContext.Provider>
  )
}
