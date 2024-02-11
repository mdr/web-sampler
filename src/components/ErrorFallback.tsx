import { Link } from 'react-router-dom' // Assuming you're using React Router for navigation

export const ErrorFallback = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="mb-4 text-4xl font-bold text-red-600">Oops!</h1>
      <p className="mb-6 text-lg">We encountered an unexpected error.</p>
      <Link to="/" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
        Home
      </Link>
    </div>
  )
}
