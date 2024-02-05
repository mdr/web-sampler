import { SoundSidebarPageLayout } from '../shared/SoundSidebarPageLayout.tsx'
import { NoSoundsMessage } from './NoSoundsMessage.tsx'
import { useSounds } from '../../sounds/soundHooks.ts'
import { EditOrCreateSoundMessage } from './EditOrCreateSoundMessage.tsx'

export const HomePage = () => {
  const sounds = useSounds()
  return (
    <SoundSidebarPageLayout>
      <div className="flex justify-center items-center h-full">
        {sounds.length === 0 ? <NoSoundsMessage /> : <EditOrCreateSoundMessage />}
      </div>
    </SoundSidebarPageLayout>
  )
}
