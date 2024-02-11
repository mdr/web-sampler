import { Link } from 'react-router-dom'

export const SoundNotFound = () => (
  <div className="flex items-center justify-center bg-gray-100">
    <div className="rounded-lg border border-gray-300 bg-white p-10 text-center shadow-lg">
      <h1 className="mb-4 text-4xl font-bold text-red-500">Oops!</h1>
      <p className="mb-5 text-lg text-gray-700">The sound you're looking for cannot be found.</p>
      <Link
        to="/"
        className="inline-block rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  </div>
)
