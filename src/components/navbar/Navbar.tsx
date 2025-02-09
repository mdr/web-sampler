import { mdiImage, mdiMenu, mdiRedo, mdiUndo, mdiViewGridOutline, mdiVolumeHigh } from '@mdi/js'
import Icon from '@mdi/react'
import { MenuTrigger, Popover } from 'react-aria-components'
import { useHotkeys } from 'react-hotkeys-hook'
import { NavLink } from 'react-router-dom'

import { useCanRedo, useCanUndo, useMiscActions } from '../../sounds/library/soundHooks.ts'
import { useStorageState } from '../../storage/storageHooks.ts'
import { Routes } from '../app/routes.ts'
import { NavbarIconButton } from './NavbarIconButton.tsx'
import { NavbarMenu } from './NavbarMenu.tsx'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { StorageWarningButton } from './StorageWarningButton.tsx'

export const Navbar = () => {
  const miscActions = useMiscActions()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const { isStoragePersistent } = useStorageState()

  useHotkeys('mod+z', () => miscActions.undo(), { preventDefault: true }, [miscActions])
  useHotkeys('mod+shift+z', () => miscActions.redo(), { preventDefault: true }, [miscActions])
  useHotkeys('ctrl+y', () => miscActions.redo(), { preventDefault: true }, [miscActions])

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li className="text-xl hover:text-gray-300">
          <NavLink data-testid={NavbarTestIds.homeLink} to="/">
            Sound Sampler
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink data-testid={NavbarTestIds.soundsLink} to={Routes.sounds}>
            <Icon path={mdiVolumeHigh} size={1} title="Sounds" />
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink data-testid={NavbarTestIds.soundboardsLink} to={Routes.soundboards}>
            <Icon path={mdiViewGridOutline} size={1} title="Soundboards" />
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink data-testid={NavbarTestIds.imagesLink} to={Routes.images}>
            <Icon path={mdiImage} size={1} title="Images" />
          </NavLink>
        </li>
        <li className="flex">
          <NavbarIconButton
            label="Undo"
            icon={mdiUndo}
            testId={NavbarTestIds.undoButton}
            disabled={!canUndo}
            onPress={() => miscActions.undo()}
          />
        </li>
        <li className="flex">
          <NavbarIconButton
            label="Redo"
            icon={mdiRedo}
            testId={NavbarTestIds.redoButton}
            disabled={!canRedo}
            onPress={() => miscActions.redo()}
          />
        </li>
        <div className="grow" />
        {!isStoragePersistent && (
          <li className="flex justify-center">
            <StorageWarningButton />
          </li>
        )}
        <li className="flex justify-end">
          <MenuTrigger>
            <NavbarIconButton testId={NavbarTestIds.menuButton} label="Menu" icon={mdiMenu} />
            <Popover className="entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95 fill-mode-forwards w-56 origin-top-left overflow-auto rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5">
              <NavbarMenu />
            </Popover>
          </MenuTrigger>
        </li>
      </ul>
    </nav>
  )
}
