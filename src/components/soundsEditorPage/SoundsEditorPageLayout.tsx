import React from 'react'
import { Navbar } from '../shared/Navbar.tsx'
import { SoundsSidebar } from './SoundsSidebar.tsx'

interface SoundSidebarPageLayoutProps {
  children?: React.ReactNode
}

export const SoundsEditorPageLayout = ({ children }: SoundSidebarPageLayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-grow">
      <div className="w-96 flex-none">
        <SoundsSidebar />
      </div>
      <div className="flex-grow border-l border-gray-200">{children}</div>
    </div>
  </div>
)
