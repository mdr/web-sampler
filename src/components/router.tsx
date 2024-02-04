import { createHashRouter } from 'react-router-dom'
import { HomePage } from './homePage/HomePage.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { EditSoundPage } from './editSoundPage/EditSoundPage.tsx'
import { SoundId } from '../types/Sound.ts'

export const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/sound/:soundId',
    element: <EditSoundPage />,
    errorElement: <ErrorFallback />,
  },
])

export const editSoundRoute = (soundId: SoundId) => `/sound/${soundId}`
