import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audioRecorder/AudioRecorderContext.ts'
import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { router } from './router.tsx'
import { AudioContextProvider, AudioContextProviderContext } from '../audioRecorder/AudioContextProvider.ts'
import { AudioPlayerContext } from '../audioPlayer/AudioPlayerContext.ts'
import { AudioPlayer } from '../audioPlayer/AudioPlayer.ts'
import { StorageManagerContext } from '../storage/StorageManagerContext.ts'
import { WebStorageManager } from '../storage/StorageManager.tsx'

export interface AppProps {
  audioContextProvider: AudioContextProvider
  audioRecorder: AudioRecorder
  audioPlayer: AudioPlayer
  soundLibrary: SoundLibrary
}

export const App = ({ audioRecorder, audioContextProvider, audioPlayer, soundLibrary }: AppProps) => (
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
      <AudioContextProviderContext.Provider value={audioContextProvider}>
        <AudioRecorderContext.Provider value={audioRecorder}>
          <AudioPlayerContext.Provider value={audioPlayer}>
            <SoundLibraryContext.Provider value={soundLibrary}>
              <StorageManagerContext.Provider value={new WebStorageManager()}>
                <RouterProvider router={router} />
              </StorageManagerContext.Provider>
            </SoundLibraryContext.Provider>
          </AudioPlayerContext.Provider>
        </AudioRecorderContext.Provider>
      </AudioContextProviderContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
