import { createHashRouter, useParams } from 'react-router-dom'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { SoundsEditorPage } from './soundsEditor/SoundsEditorPage.tsx'
import { SoundId } from '../types/Sound.ts'
import { Option } from '../utils/types/Option.ts'
import { SoundboardPage } from './soundboard/SoundboardPage.tsx'
import { SoundboardId } from '../types/Soundboard.ts'
import { SoundboardsEditorPage } from './soundboardsEditor/SoundboardsEditorPage.tsx'

export const router = createHashRouter([
  {
    path: '/',
    element: <SoundsEditorPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/soundboards',
    element: <SoundboardsEditorPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/sound/:soundId',
    element: <SoundsEditorPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/soundboard',
    element: <SoundboardPage />,
    errorElement: <ErrorFallback />,
  },
])

export const useSoundIdParam = (): Option<SoundId> => {
  const { soundId } = useParams()
  return soundId === undefined ? undefined : SoundId(soundId)
}

export const useSoundboardIdParam = (): Option<SoundboardId> => {
  const { soundboardId } = useParams()
  return soundboardId === undefined ? undefined : SoundboardId(soundboardId)
}

export const editSoundRoute = (soundId: SoundId) => `/sound/${soundId}`
