import { createHashRouter } from 'react-router-dom'
import { ErrorFallback } from './ErrorFallback.tsx'
import { SoundsEditorPage } from './soundsEditorPage/SoundsEditorPage.tsx'
import { SoundId } from '../types/Sound.ts'

export const router = createHashRouter([
  {
    path: '/',
    element: <SoundsEditorPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/sound/:soundId',
    element: <SoundsEditorPage />,
    errorElement: <ErrorFallback />,
  },
])

export const editSoundRoute = (soundId: SoundId) => `/sound/${soundId}`
