import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './HomePage.tsx'
import { CapturePage } from './capture/CapturePage.tsx'
import { AudioRecorderFactoryContext } from '../audio/AudioRecorderFactoryContext.ts'
import { AudioRecorderFactory } from '../audio/IAudioRecorder.ts'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/capture',
    element: <CapturePage />,
  },
])

export const App = ({ audioRecorderFactory }: AppProps) => (
  <React.StrictMode>
    <AudioRecorderFactoryContext.Provider value={audioRecorderFactory}>
      <RouterProvider router={router} />
    </AudioRecorderFactoryContext.Provider>
  </React.StrictMode>
)

export interface AppProps {
  audioRecorderFactory: AudioRecorderFactory
}
