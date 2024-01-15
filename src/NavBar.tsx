import React from 'react'

export const Navbar: React.FC = () => (
  <nav className="bg-gray-800 text-white p-4">
    <ul className="flex items-baseline space-x-4">
      <li className="text-xl hover:text-gray-300">
        <a href="/">Web Sampler</a>
      </li>
      <li className="hover:text-gray-300">
        <a href="/about">About</a>
      </li>
      <li className="hover:text-gray-300">
        <a href="/services">Services</a>
      </li>
      <li className="hover:text-gray-300">
        <a href="/contact">Contact</a>
      </li>
    </ul>
  </nav>
)
