import { createHashRouter } from 'react-router-dom'

import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { NotFoundPage } from './misc/NotFoundPage.tsx'
import { SoundboardPage } from './soundboard/SoundboardPage.tsx'
import { SoundboardsEditorPage } from './soundboardsEditor/SoundboardsEditorPage.tsx'
import { SoundsEditorPage } from './soundsEditor/SoundsEditorPage.tsx'

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
    path: '/play',
    element: <SoundboardPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '/soundboard/:soundboardId',
    element: <SoundboardsEditorPage />,
    errorElement: <ErrorFallback />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
