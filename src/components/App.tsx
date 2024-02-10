import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audioRecorder/AudioRecorderContext.ts'
import { AudioRecorder } from '../audioRecorder/AudioRecorder.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback.tsx'
import { router } from './router.tsx'
import { AudioContextProvider, AudioContextProviderContext } from '../audioRecorder/AudioContextProvider.ts'

export interface AppProps {
  audioContextProvider: AudioContextProvider
  audioRecorder: AudioRecorder
}

export const App = ({ audioRecorder, audioContextProvider }: AppProps) => (
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
      <AudioContextProviderContext.Provider value={audioContextProvider}>
        <AudioRecorderContext.Provider value={audioRecorder}>
          <SoundLibraryContext.Provider value={new SoundLibrary()}>
            <RouterProvider router={router} />
          </SoundLibraryContext.Provider>
        </AudioRecorderContext.Provider>
      </AudioContextProviderContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
