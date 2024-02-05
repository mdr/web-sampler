import React from 'react'
import { Navbar } from './Navbar.tsx'
import { SoundSidebar } from './SoundSidebar.tsx'

interface SoundSidebarPageLayoutProps {
  children?: React.ReactNode
}

export const SoundSidebarPageLayout = ({ children }: SoundSidebarPageLayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
      <div className="w-96 flex-none">
        <SoundSidebar />
      </div>
      <div className="flex-grow border-l border-gray-200">{children}</div>
    </div>
  </div>
)
