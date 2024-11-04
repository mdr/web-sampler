import { createHashRouter } from 'react-router-dom'

import { ImagesEditorPage } from './images/ImagesEditorPage.tsx'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { NotFoundPage } from './misc/NotFoundPage.tsx'
import { Routes } from './routes.ts'
import { SoundboardPage } from './soundboard/SoundboardPage.tsx'
import { SoundboardsEditorPage } from './soundboardsEditor/SoundboardsEditorPage.tsx'
import { SoundsEditorPage } from './soundsEditor/SoundsEditorPage.tsx'

export const router = createHashRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />, // Shared fallback for all child routes
    children: [
      { path: '/', element: <SoundsEditorPage /> },
      { path: Routes.sounds, element: <SoundsEditorPage /> },
      { path: '/sound/:soundId', element: <SoundsEditorPage /> },
      { path: Routes.soundboards, element: <SoundboardsEditorPage /> },
      { path: '/soundboard/:soundboardId', element: <SoundboardsEditorPage /> },
      { path: Routes.images, element: <ImagesEditorPage /> },
      { path: '/image/:imageId', element: <ImagesEditorPage /> },
      { path: '/play', element: <SoundboardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
