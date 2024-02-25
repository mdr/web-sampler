import { Key, Menu, MenuItem } from 'react-aria-components'
import { useSounds } from '../../../sounds/soundHooks.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import { zipSounds } from './importExport/exportSounds.ts'
import FileSaver from 'file-saver'
import { toast } from 'react-toastify'
import Icon from '@mdi/react'
import { mdiExport, mdiImport } from '@mdi/js'

const NavbarMenuIds = {
  exportSounds: 'exportSounds',
  importSounds: 'importSounds',
}

export const NavbarMenu = () => {
  const sounds = useSounds()
  const doExport = () =>
    fireAndForget(async () => {
      const zipBlob = await zipSounds(sounds)
      FileSaver.saveAs(zipBlob, 'sounds.zip')
      toast.info('All sounds exported.')
    })
  const handleAction = (key: Key) => {
    switch (key) {
      case NavbarMenuIds.exportSounds:
        doExport()
        break
      case NavbarMenuIds.importSounds:
        break
    }
  }
  return (
    <Menu onAction={handleAction} className="p-4">
      <MenuItem id={NavbarMenuIds.exportSounds} className="mb-4 flex p-2 text-gray-700 hover:bg-gray-100">
        <Icon path={mdiExport} size={1} className="mr-2" /> Export All Sounds
      </MenuItem>
      <MenuItem id={NavbarMenuIds.importSounds} className="flex p-2 text-gray-700 hover:bg-gray-100">
        <Icon path={mdiImport} size={1} className="mr-2" /> Import Sounds…
      </MenuItem>
    </Menu>
  )
}
