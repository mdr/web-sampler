import { NavLink } from 'react-router-dom'

export const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex items-baseline space-x-4">
      <li className="text-xl hover:text-gray-300">
        <NavLink to="/">Sound Sampler</NavLink>
      </li>
    </ul>
  </nav>
)
