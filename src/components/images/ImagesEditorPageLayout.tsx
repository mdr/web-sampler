import { ReactNode } from 'react'
import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels'

import { Navbar } from '../navbar/Navbar.tsx'
import { ImagesSidebar } from './sidebar/ImagesSidebar.tsx'

interface ImagesEditorPageLayoutProps {
  children?: ReactNode
}

export const ImagesEditorPageLayout = ({ children }: ImagesEditorPageLayoutProps) => {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: 'ImagesEditorPage' })
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Group className="grow" orientation="horizontal" defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged}>
        <Panel id="sidebar" collapsible={true} defaultSize="15%" minSize="5%">
          <ImagesSidebar />
        </Panel>
        <Separator className="border-l border-gray-200" />
        <Panel id="main" defaultSize="85%" minSize="20%">
          {children}
        </Panel>
      </Group>
    </div>
  )
}
