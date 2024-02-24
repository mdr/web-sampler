import { SoundSidebarTestIds } from '../EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { useSounds } from '../../../sounds/soundHooks.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import FileSaver from 'file-saver'
import { zipSounds } from './exportSounds.ts'

export const ExportSoundsButton = () => {
  const sounds = useSounds()
  const doExport = () =>
    fireAndForget(async () => {
      const zipBlob = await zipSounds(sounds)
      FileSaver.saveAs(zipBlob, 'sounds.zip')
    })
  return (
    <Button
      testId={SoundSidebarTestIds.exportSoundsButton}
      icon={mdiDownload}
      label="Export Sounds"
      onPress={doExport}
    />
  )
}
