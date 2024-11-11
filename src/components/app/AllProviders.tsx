/* eslint-disable react/jsx-key */
import React, { FC, PropsWithChildren } from 'react'
import reactArrayToTree from 'react-array-to-tree'

import { AudioOperationsContext } from '../../audioOperations/AudioOperationsContext.ts'
import { AudioPlayerContext } from '../../audioPlayer/AudioPlayerContext.ts'
import { AudioRecorderContext } from '../../audioRecorder/AudioRecorderContext.ts'
import { AppConfig } from '../../config/AppConfig.ts'
import { SoundLibraryContext } from '../../sounds/library/SoundLibraryContext.ts'
import { StorageServiceContext } from '../../storage/storageHooks.ts'

export interface AllProvidersProps {
  config: AppConfig
  children: React.ReactNode
}

export const AllProviders = ({ config, children }: AllProvidersProps) => {
  const NestedProviders = nestProviders(config)
  return <NestedProviders>{children}</NestedProviders>
}

const nestProviders = (config: AppConfig): FC<PropsWithChildren> => {
  const { audioRecorder, audioPlayer, soundLibrary, storageService, audioOperations } = config
  return reactArrayToTree([
    <AudioRecorderContext.Provider value={audioRecorder} />,
    <AudioPlayerContext.Provider value={audioPlayer} />,
    <AudioOperationsContext.Provider value={audioOperations} />,
    <SoundLibraryContext.Provider value={soundLibrary} />,
    <StorageServiceContext.Provider value={storageService} />,
  ]) as FC<PropsWithChildren>
}
