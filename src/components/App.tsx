import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audioRecorder/AudioRecorderContext.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { router } from './router.tsx'
import { AudioPlayerContext } from '../audioPlayer/AudioPlayerContext.ts'
import { StorageManagerContext } from '../storage/StorageManagerContext.ts'
import { AppConfig } from '../config/AppConfig.ts'
import reactArrayToTree from 'react-array-to-tree'
import { ExclusiveTab } from './misc/ExclusiveTab.tsx'
import { AlreadyOpenInAnotherTabPage } from './misc/AlreadyOpenInAnotherTabPage.tsx'

export interface AppProps {
  config: AppConfig
}

const nestProviders = (config: AppConfig) => {
  const { audioRecorder, audioPlayer, soundLibrary, storageManager } = config
  return reactArrayToTree([
    <AudioRecorderContext.Provider value={audioRecorder} />,
    <AudioPlayerContext.Provider value={audioPlayer} />,
    <SoundLibraryContext.Provider value={soundLibrary} />,
    <StorageManagerContext.Provider value={storageManager} />,
  ])
}

export const App = ({ config }: AppProps) => {
  const AllProviders = nestProviders(config)
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ExclusiveTab fallback={<AlreadyOpenInAnotherTabPage />}>
          <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
          <AllProviders config={config}>
            <RouterProvider router={router} />
          </AllProviders>
        </ExclusiveTab>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
