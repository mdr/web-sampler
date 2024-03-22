import { NavLink } from 'react-router-dom'
import { mdiMenu, mdiRedo, mdiUndo, mdiViewGridOutline } from '@mdi/js'
import { useCanRedo, useCanUndo, useSoundActions } from '../../sounds/soundHooks.ts'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { useHotkeys } from 'react-hotkeys-hook'
import { StorageWarningButton } from './StorageWarningButton.tsx'
import { useStorageManagerState } from '../../storage/storageManagerHooks.ts'
import { NavbarIconButton } from './NavbarIconButton.tsx'
import { MenuTrigger, Popover } from 'react-aria-components'
import { NavbarMenu } from './NavbarMenu.tsx'
import Icon from '@mdi/react'
import { playSoundboardRoute } from '../router.tsx'

export const Navbar = () => {
  const soundActions = useSoundActions()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const { isStoragePersistent } = useStorageManagerState()

  useHotkeys('mod+z', () => soundActions.undo(), { preventDefault: true }, [soundActions])
  useHotkeys('mod+shift+z', () => soundActions.redo(), { preventDefault: true }, [soundActions])
  useHotkeys('ctrl+y', () => soundActions.redo(), { preventDefault: true }, [soundActions])

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li className="text-xl hover:text-gray-300">
          <NavLink data-testid={NavbarTestIds.homeLink} to="/">
            Sound Sampler
          </NavLink>
        </li>
        <li className="flex items-center">
          <NavLink to={playSoundboardRoute()}>
            <Icon path={mdiViewGridOutline} size={1} title="Soundboard" />
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
