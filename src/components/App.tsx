import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audio/AudioRecorderContext.ts'
import { IAudioRecorder } from '../audio/IAudioRecorder.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './ErrorFallback.tsx'
import { router } from './router.tsx'

export const App = ({ audioRecorder }: AppProps) => (
  <React.StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
      <AudioRecorderContext.Provider value={audioRecorder}>
        <SoundLibraryContext.Provider value={new SoundLibrary()}>
          <RouterProvider router={router} />
        </SoundLibraryContext.Provider>
      </AudioRecorderContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>
)

export interface AppProps {
  audioRecorder: IAudioRecorder
}
