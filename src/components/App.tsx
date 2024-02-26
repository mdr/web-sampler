import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audioRecorder/AudioRecorderContext.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { router } from './router.tsx'
import { AudioContextProviderContext } from '../audioRecorder/AudioContextProvider.ts'
import { AudioPlayerContext } from '../audioPlayer/AudioPlayerContext.ts'
import { StorageManagerContext } from '../storage/StorageManagerContext.ts'
import { WebStorageManager } from '../storage/StorageManager.tsx'
import { AppConfig } from '../config/AppConfig.ts'
import reactArrayToTree from 'react-array-to-tree'

export interface AppProps {
  config: AppConfig
}

const nestProviders = (config: AppConfig) => {
  const { audioRecorder, audioContextProvider, audioPlayer, soundLibrary } = config
  return reactArrayToTree([
    <AudioContextProviderContext.Provider value={audioContextProvider} />,
    <AudioRecorderContext.Provider value={audioRecorder} />,
    <AudioPlayerContext.Provider value={audioPlayer} />,
    <SoundLibraryContext.Provider value={soundLibrary} />,
    <StorageManagerContext.Provider value={new WebStorageManager()} />,
  ])
}

export const App = ({ config }: AppProps) => {
  const AllProviders = nestProviders(config)
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
        <AllProviders config={config}>
          <RouterProvider router={router} />
        </AllProviders>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
