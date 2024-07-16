import { useSoundActions, useSoundboardAndSounds } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { AddSoundButton } from './AddSoundButton.tsx'
import { useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { ResizePayload } from 'react-resize-detector/build/types/types'
import { getSoundDisplayName } from '../../../types/Sound.ts'
import { Pixels } from '../../../utils/types/brandedTypes.ts'

const SOUND_ITEM_SIZE = Pixels(100)

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundActions = useSoundActions()
  const { soundboard, sounds } = useSoundboardAndSounds(soundboardId)
  const [columns, setColumns] = useState(1)

  const onResize = ({ width }: ResizePayload) => {
    console.log(onResize)
    if (width) {
      const newColumns = Math.floor(width / SOUND_ITEM_SIZE)
      setColumns(newColumns > 0 ? newColumns : 1)
    }
  }

  const { ref } = useResizeDetector({ onResize })

  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <div className="flex justify-center">
        <AddSoundButton soundboardId={soundboardId} />
      </div>
      <div
        ref={ref}
        className="grid gap-x-4 gap-y-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {sounds.map((sound) => (
          <div
            key={sound.id}
            className="flex aspect-square h-24 w-24 flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100"
          >
            <div className="text-center">{getSoundDisplayName(sound)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
