import { Link } from 'react-router-dom'

export const SoundNotFound = () => (
  <div className="flex items-center justify-center bg-gray-100">
    <div className="text-center p-10 border border-gray-300 rounded-lg shadow-lg bg-white">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
      <p className="text-lg text-gray-700 mb-5">The sound you're looking for cannot be found.</p>
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  </div>
)
