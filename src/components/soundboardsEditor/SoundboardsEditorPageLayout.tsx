import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Navbar } from '../soundsEditor/navbar/Navbar.tsx'

interface SoundboardsEditorPageLayoutProps {
  children?: React.ReactNode
}

export const SoundboardsEditorPageLayout = ({ children }: SoundboardsEditorPageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <PanelGroup autoSaveId="SoundboardsEditorPage" className="flex-grow" direction="horizontal">
      <Panel collapsible={true} defaultSize={15} minSize={5}>
        {/*<SoundsSidebar />*/}
      </Panel>
      <PanelResizeHandle className="border-l border-gray-200" />
      <Panel defaultSize={85} minSize={20}>
        {children}
      </Panel>
    </PanelGroup>
  </div>
)
