import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './HomePage.tsx'
import { CapturePage } from './capture/CapturePage.tsx'
import { AudioRecorderContext } from '../audio/AudioRecorderContext.ts'
import { IAudioRecorder } from '../audio/IAudioRecorder.ts'
import { ToastContainer } from 'react-toastify'

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/capture',
    element: <CapturePage />,
  },
])

export const App = ({ audioRecorder }: AppProps) => (
  <React.StrictMode>
    <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
    <AudioRecorderContext.Provider value={audioRecorder}>
      <RouterProvider router={router} />
    </AudioRecorderContext.Provider>
  </React.StrictMode>
)

export interface AppProps {
  audioRecorder: IAudioRecorder
}
