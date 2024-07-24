import { SOUND_TILE_SIZE } from './soundTileConstants.ts'
import { Pixels } from '../../../utils/types/brandedTypes.ts'

export interface PlaceholderTileProps {
  // For reasons not yet bottomed out, the placeholder disappears when it's the only item on its row unless
  // we reduce the height a bit.
  fudgeHeight?: boolean
}

export const PlaceholderTile = ({ fudgeHeight }: PlaceholderTileProps) => {
  const height = Pixels(SOUND_TILE_SIZE - (fudgeHeight ? 10 : 0))
  return <div className={`h-[${height}px] border-2 border-dashed border-gray-400 bg-blue-50`} />
}
