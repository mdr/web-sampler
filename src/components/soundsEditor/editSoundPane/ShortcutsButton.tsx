import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiKeyboard } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'

export interface ShortcutsButtonProps {
  onPress(): void
}

export const ShortcutsButton = ({ onPress }: ShortcutsButtonProps) => (
  <Button testId={EditSoundPaneTestIds.shortcutsButton} icon={mdiKeyboard} label="Shortcuts" onPress={onPress} />
)
