import { mdiStop } from '@mdi/js'
import React from 'react'

import { doNothing } from '../../../utils/utils.ts'
import { Button } from '../../shared/Button.tsx'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

interface StopButtonProps {
  onPress?: () => void
}

export const StopButton: React.FC<StopButtonProps> = ({ onPress = doNothing }) => (
  <Button testId={EditSoundPaneTestIds.stopButton} icon={mdiStop} label="Stop Capture" onPress={onPress} />
)
