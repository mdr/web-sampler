import { Link } from 'react-router-dom' // Assuming you're using React Router for navigation

export const ErrorFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg mb-6">We encountered an unexpected error.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Home
      </Link>
    </div>
  )
}
