import { Navigate, createHashRouter } from 'react-router-dom'

import { ImagesEditorPage } from '../images/ImagesEditorPage.tsx'
import { ErrorFallback } from '../misc/ErrorFallback.tsx'
import { NotFoundPage } from '../misc/NotFoundPage.tsx'
import { SoundboardPage } from '../soundboard/SoundboardPage.tsx'
import { SoundboardsEditorPage } from '../soundboardsEditor/SoundboardsEditorPage.tsx'
import { SoundsEditorPage } from '../soundsEditor/SoundsEditorPage.tsx'
import { Routes } from './routes.ts'

export const router = createHashRouter(
  [
    {
      path: '/',
      errorElement: <ErrorFallback />,
      children: [
        { path: '/', element: <Navigate to={Routes.sounds} replace /> },
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
  ],
  // Suppress react-router-dom warning spam: https://github.com/remix-run/react-router/issues/12245#issuecomment-2464607080
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
)
