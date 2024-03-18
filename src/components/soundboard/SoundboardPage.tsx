import { useSounds } from '../../sounds/soundHooks.ts'
import { SoundButton } from './SoundButton.tsx'
import { sortSoundsByDisplayName, soundHasAudio } from '../../types/Sound.ts'
import GridLayout, { Layout } from 'react-grid-layout'
import { useMeasure } from 'react-use'
import { Pixels } from '../../utils/types/brandedTypes.ts'

const EXPERIMENTAL = true

export const SoundboardPage = () => {
  const sounds = sortSoundsByDisplayName(useSounds()).filter(soundHasAudio)
  const columns = 7
  const [ref, rect] = useMeasure<HTMLDivElement>()
  const width = Pixels(rect.width)

  const layouts: Layout[] = sounds.map((_sound, index) => ({
    i: `${index}`,
    x: index % columns,
    y: Math.floor(index / columns),
    w: 1,
    h: 1,
    isResizable: false,
  }))
  return EXPERIMENTAL ? (
    <div ref={ref}>
      <GridLayout
        layout={layouts}
        cols={columns}
        rowHeight={150}
        width={width}
        compactType={'horizontal'}
        isResizable={false}
        onLayoutChange={(layouts) => {
          console.log(layouts)
        }}
        // autoSize
        // isBounded
      >
        {sounds.map((sound, index) => (
          <div className="h-[150px] w-[150px] border-2" key={index}>
            <SoundButton key={sound.id} hotkey={index + 1 + ''} sound={sound} />
          </div>
        ))}
      </GridLayout>
    </div>
  ) : (
    <div className="grid grid-cols-[repeat(auto-fill,_150px)] gap-4 p-4">
      {sounds.map((sound, i) => (
        <SoundButton key={sound.id} hotkey={i + 1 + ''} sound={sound} />
      ))}
    </div>
  )
}
