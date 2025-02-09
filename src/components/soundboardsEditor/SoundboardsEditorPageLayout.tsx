import { ReactNode } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { Navbar } from '../navbar/Navbar.tsx'
import { SoundboardsSidebar } from './sidebar/SoundboardsSidebar.tsx'

interface SoundboardsEditorPageLayoutProps {
  children?: ReactNode
}

export const SoundboardsEditorPageLayout = ({ children }: SoundboardsEditorPageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <PanelGroup autoSaveId="SoundboardsEditorPage" className="grow" direction="horizontal">
      <Panel collapsible={true} defaultSize={15} minSize={5}>
        <SoundboardsSidebar />
      </Panel>
      <PanelResizeHandle className="border-l border-gray-200" />
      <Panel defaultSize={85} minSize={20}>
        {children}
      </Panel>
    </PanelGroup>
  </div>
)
