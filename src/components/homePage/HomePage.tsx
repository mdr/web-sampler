import { SoundSidebarPageLayout } from '../shared/SoundSidebarPageLayout.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'

export const HomePage = () => (
  <SoundSidebarPageLayout>
    <div className="flex justify-center items-center h-full">
      <NoSoundsMessage />
    </div>
  </SoundSidebarPageLayout>
)
