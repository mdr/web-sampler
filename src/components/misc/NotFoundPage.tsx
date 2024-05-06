import { Link } from 'react-router-dom'
import { MiscTestIds } from './MiscTestIds.ts' // Assuming you're using React Router for navigation

export const NotFoundPage = () => (
  <div
    data-testid={MiscTestIds.notFoundPage}
    className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center"
  >
    <h1 className="mb-4 text-4xl font-bold text-red-600">Not Found</h1>
    <p className="mb-6 text-lg">We couldn't find anything at this location.</p>
    <Link to="/" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
      Home
    </Link>
  </div>
)
