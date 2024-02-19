import { createHashRouter, useParams } from 'react-router-dom'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { SoundsEditorPage } from './soundsEditorPage/SoundsEditorPage.tsx'
import { SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'

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

export const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}

export const editSoundRoute = (soundId: SoundId) => `/sound/${soundId}`
