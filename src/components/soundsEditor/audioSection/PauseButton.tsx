import { mdiPause } from '@mdi/js'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useAudioPlayerActions } from '../../../audioPlayer/audioPlayerHooks.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'

export const PauseButton = () => {
  const audioPlayerActions = useAudioPlayerActions()
  const pause = useCallback(() => {
    audioPlayerActions.pause()
  }, [audioPlayerActions])
  useHotkeys('space', pause, [pause])
  return <Button testId={EditSoundPaneTestIds.pauseButton} icon={mdiPause} iconOnly label="Pause" onPress={pause} />
}
