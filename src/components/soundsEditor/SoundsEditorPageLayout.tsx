import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { Navbar } from '../navbar/Navbar.tsx'
import { SoundsSidebar } from './sidebar/SoundsSidebar.tsx'

interface SoundsEditorPageLayoutProps {
  children?: React.ReactNode
}

export const SoundsEditorPageLayout = ({ children }: SoundsEditorPageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <PanelGroup autoSaveId="SoundsEditorPage" className="flex-grow" direction="horizontal">
      <Panel collapsible={true} defaultSize={15} minSize={5}>
        <SoundsSidebar />
      </Panel>
      <PanelResizeHandle className="border-l border-gray-200" />
      <Panel defaultSize={85} minSize={20}>
        {children}
      </Panel>
    </PanelGroup>
  </div>
)
