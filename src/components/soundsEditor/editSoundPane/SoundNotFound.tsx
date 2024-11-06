import { useNavigate } from 'react-router-dom'

import { Routes } from '../../app/routes.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'

export const SoundNotFound = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="rounded-lg border border-gray-300 bg-white p-10 text-center shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-red-500">Oops!</h1>
        <p className="mb-5 text-lg text-gray-700">The sound you're looking for cannot be found.</p>
        <Button variant={ButtonVariant.PRIMARY} label="Go Home" onPress={() => navigate(Routes.sounds)} />
      </div>
    </div>
  )
}
