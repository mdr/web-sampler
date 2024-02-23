import { SoundSidebarTestIds } from '../EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { Button } from '../../shared/Button.tsx'
import { useSounds } from '../../../sounds/soundHooks.ts'
import { BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import { Sound } from '../../../types/Sound.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import FileSaver from 'file-saver'

interface ZipExportMetadata {
  version: number
}

const zipSounds = async (sounds: readonly Sound[]): Promise<Blob> => {
  const zipFileWriter = new BlobWriter()
  const metadata: ZipExportMetadata = { version: 1 }
  const metadataReader = new TextReader(JSON.stringify(metadata, null, 2))
  const zipWriter = new ZipWriter(zipFileWriter)
  console.log(sounds)
  await zipWriter.add('metadata.json', metadataReader)

  return await zipWriter.close()
}

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
