import React from 'react'
import { Navbar } from '../shared/Navbar.tsx'
import { SoundSidebar } from './SoundSidebar.tsx'

interface EditSoundPageLayoutProps {
  children: React.ReactNode
}

export const EditSoundPageLayout = ({ children }: EditSoundPageLayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
      <div className="w-64 flex-none">
        <SoundSidebar />
      </div>
      <div className="flex-grow border-l border-gray-200">{children}</div>
    </div>
  </div>
)
