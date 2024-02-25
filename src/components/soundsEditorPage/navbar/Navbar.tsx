import { NavLink } from 'react-router-dom'
import { mdiMenu, mdiRedo, mdiUndo } from '@mdi/js'
import { useCanRedo, useCanUndo, useSoundActions } from '../../../sounds/soundHooks.ts'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { useHotkeys } from 'react-hotkeys-hook'
import { StorageWarningButton } from './StorageWarningButton.tsx'
import { useStorageManagerState } from '../../../storage/storageManagerHooks.ts'
import { NavbarIconButton } from './NavbarIconButton.tsx'
import { Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components'

export const Navbar = () => {
  const soundActions = useSoundActions()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const { isStoragePersistent } = useStorageManagerState()

  useHotkeys('mod+z', () => soundActions.undo(), [soundActions])
  useHotkeys('mod+shift+z', () => soundActions.redo(), [soundActions])
  useHotkeys('ctrl+y', () => soundActions.redo(), [soundActions])

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li className="text-xl hover:text-gray-300">
          <NavLink data-testid={NavbarTestIds.homeLink} to="/">
            Sound Sampler
          </NavLink>
        </li>
        <li className="flex">
          <NavbarIconButton
            label="Undo"
            icon={mdiUndo}
            testId={NavbarTestIds.undoButton}
            disabled={!canUndo}
            onPress={soundActions.undo}
          />
        </li>
        <li className="flex">
          <NavbarIconButton
            label="Redo"
            icon={mdiRedo}
            testId={NavbarTestIds.redoButton}
            disabled={!canRedo}
            onPress={soundActions.redo}
          />
        </li>
        <div className="flex-grow" />
        {!isStoragePersistent && (
          <li className="flex justify-center">
            <StorageWarningButton />
          </li>
        )}
        <li className="flex justify-end">
          <MenuTrigger>
            <NavbarIconButton label="Storage Warning" icon={mdiMenu} testId={NavbarTestIds.storageWarningButton} />
            <Popover className="overflow-hidden rounded-lg bg-white shadow-lg">
              <Menu onAction={alert} className="p-2">
                <MenuItem id="exportSounds" className="px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Export Sounds
                </MenuItem>
                <MenuItem id="importSounds" className="px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Import Sounds…
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </li>
      </ul>
    </nav>
  )
}
