import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './HomePage.tsx'
import { EditSoundPage } from './capture/EditSoundPage.tsx'
import { AudioRecorderContext } from '../audio/AudioRecorderContext.ts'
import { IAudioRecorder } from '../audio/IAudioRecorder.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/SoundLibraryContext.ts'
import { SoundLibrary } from '../sounds/SoundLibrary.ts'

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sound',
    element: <EditSoundPage />,
  },
])

export const App = ({ audioRecorder }: AppProps) => (
  <React.StrictMode>
    <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
    <AudioRecorderContext.Provider value={audioRecorder}>
      <SoundLibraryContext.Provider value={new SoundLibrary()}>
        <RouterProvider router={router} />
      </SoundLibraryContext.Provider>
    </AudioRecorderContext.Provider>
  </React.StrictMode>
)

export interface AppProps {
  audioRecorder: IAudioRecorder
}
