import { Label, Slider, SliderOutput, SliderThumb, SliderTrack } from 'react-aria-components'

export const VolumeSlider = () => (
  <div className="mt-4 flex justify-center rounded-lg bg-blue-500 px-6 py-4">
    <Slider defaultValue={30} className="w-[250px]">
      <div className="flex text-white">
        <Label className="flex-1">Sound Volume</Label>
        <SliderOutput />
      </div>
      <SliderTrack className="relative h-7 w-full">
        {({ state }) => (
          <>
            {/* track */}
            <div className="absolute top-[50%] h-2 w-full translate-y-[-50%] rounded-full bg-white/40" />
            {/* fill */}
            <div
              className="absolute top-[50%] h-2 translate-y-[-50%] rounded-full bg-white"
              style={{
                width: state.getThumbPercent(0) * 100 + '%',
              }}
            />
            <SliderThumb className="dragging:bg-gray-100 top-[50%] h-7 w-7 rounded-full border border-solid border-gray-800/75 bg-white outline-none ring-black transition focus-visible:ring-2" />
          </>
        )}
      </SliderTrack>
    </Slider>
  </div>
)