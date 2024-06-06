import { Key, Menu, MenuItem } from 'react-aria-components'
import { useSoundActions, useSounds } from '../../sounds/library/soundHooks.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { zipSounds } from './importExport/exportSounds.ts'
import FileSaver from 'file-saver'
import { toast } from 'react-toastify'
import Icon from '@mdi/react'
import { mdiExport, mdiImport } from '@mdi/js'
import { useFilePicker } from 'use-file-picker'
import { unzipSounds } from './importExport/importSounds.ts'
import { Sound } from '../../types/Sound.ts'
import { SelectedFiles } from 'use-file-picker/types'
import { useNavigate } from 'react-router-dom'
import { NavbarTestIds } from './NavbarTestIds.ts'

const NavbarMenuIds = {
  exportAllSounds: 'exportSounds',
  importSounds: 'importSounds',
}

export const NavbarMenu = () => {
  const sounds = useSounds()
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handleFilesSuccessfullySelected = async ({ filesContent }: SelectedFiles<ArrayBuffer>): Promise<void> => {
    const zipBlob = new Blob([filesContent[0].content])
    let sounds: readonly Sound[]
    try {
      sounds = await unzipSounds(zipBlob)
    } catch (e) {
      console.error('Error importing sounds', e)
      toast.error('Error importing sounds.')
      return
    }
    soundActions.importSounds(sounds)
    navigate('/')
    toast.info('Sounds imported successfully.')
  }

  const { openFilePicker } = useFilePicker({
    readAs: 'ArrayBuffer',
    accept: '.sounds',
    onFilesSuccessfullySelected: handleFilesSuccessfullySelected,
  })

  const doExport = () =>
    fireAndForget(async () => {
      const zipBlob = await zipSounds(sounds)
      FileSaver.saveAs(zipBlob, 'library.sounds')
      toast.info('All sounds exported.')
    })

  const doImport = () => openFilePicker()

  const handleAction = (key: Key) => {
    switch (key) {
      case NavbarMenuIds.exportAllSounds:
        doExport()
        break
      case NavbarMenuIds.importSounds:
        doImport()
        break
    }
  }
  return (
    <Menu onAction={handleAction} className="outline-none">
      <MenuItem
        id={NavbarMenuIds.exportAllSounds}
        data-testid={NavbarTestIds.exportAllSoundsMenuItem}
        className="group box-border flex w-full cursor-default items-center rounded-md px-3 py-2 text-gray-900 outline-none focus:bg-gray-500 focus:text-white"
      >
        <Icon path={mdiExport} size={1} className="mr-2" /> Export All Sounds
      </MenuItem>
      <MenuItem
        id={NavbarMenuIds.importSounds}
        data-testid={NavbarTestIds.importSoundsMenuItem}
        className="group box-border flex w-full cursor-default items-center rounded-md px-3 py-2 text-gray-900 outline-none focus:bg-gray-500 focus:text-white"
      >
        <Icon path={mdiImport} size={1} className="mr-2" /> Import Sounds…
      </MenuItem>
    </Menu>
  )
}
