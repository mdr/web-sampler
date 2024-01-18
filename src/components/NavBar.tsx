import React from 'react'
import { NavLink } from 'react-router-dom'

export const Navbar: React.FC = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex items-baseline space-x-4">
      <li className="text-xl hover:text-gray-300">
        <NavLink to={'/'}>Web Sampler</NavLink>
      </li>
      <li>
        <NavLink
          to="/capture"
          className={({ isActive }) => (isActive ? 'font-bold text-white' : 'hover:text-gray-300')}
        >
          Capture
        </NavLink>
      </li>
    </ul>
  </nav>
)
