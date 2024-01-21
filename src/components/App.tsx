import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './HomePage.tsx'
import { CapturePage } from './CapturePage.tsx'

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

export const App = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
