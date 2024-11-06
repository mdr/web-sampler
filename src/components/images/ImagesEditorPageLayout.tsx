import { ReactNode } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { Navbar } from '../navbar/Navbar.tsx'
import { ImagesSidebar } from './sidebar/ImagesSidebar.tsx'

interface ImagesEditorPageLayoutProps {
  children?: ReactNode
}

export const ImagesEditorPageLayout = ({ children }: ImagesEditorPageLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <PanelGroup autoSaveId="ImagesEditorPage" className="flex-grow" direction="horizontal">
      <Panel collapsible={true} defaultSize={15} minSize={5}>
        <ImagesSidebar />
      </Panel>
      <PanelResizeHandle className="border-l border-gray-200" />
      <Panel defaultSize={85} minSize={20}>
        {children}
      </Panel>
    </PanelGroup>
  </div>
)
