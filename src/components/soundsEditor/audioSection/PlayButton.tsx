import { mdiPlay } from '@mdi/js'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useAudioPlayerActions } from '../../../audioPlayer/audioPlayerHooks.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

export const PlayButton = () => {
  const audioPlayerActions = useAudioPlayerActions()
  const play = useCallback(() => {
    fireAndForget(audioPlayerActions.play)
  }, [audioPlayerActions])
  useHotkeys('space', play, [play])
  return <Button testId={EditSoundPaneTestIds.playButton} icon={mdiPlay} iconOnly label="Play" onPress={play} />
}
