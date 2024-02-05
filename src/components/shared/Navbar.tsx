import { NavLink } from 'react-router-dom'
import { NavbarTestIds } from './NavbarTestIds.ts'

export const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex items-baseline space-x-4">
      <li className="text-xl hover:text-gray-300">
        <NavLink data-testid={NavbarTestIds.homeLink} to="/">
          Sound Sampler
        </NavLink>
      </li>
    </ul>
  </nav>
)
