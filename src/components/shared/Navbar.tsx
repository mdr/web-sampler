import { NavLink } from 'react-router-dom'
import { mdiRedo, mdiUndo } from '@mdi/js'
import Icon from '@mdi/react'
import { Button } from 'react-aria-components'
import { useCanRedo, useCanUndo, useSoundActions } from '../../sounds/soundHooks.ts'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { useHotkeys } from 'react-hotkeys-hook'

export const Navbar = () => {
  const soundActions = useSoundActions()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  useHotkeys('mod+z', () => soundActions.undo(), [soundActions])
  useHotkeys('mod+shift+z', () => soundActions.redo(), [soundActions])
  useHotkeys('ctrl+y', () => soundActions.redo(), [soundActions])

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li className="text-xl hover:text-gray-300">
          <NavLink data-testid={NavbarTestIds.homeLink} to="/">
            Sound Sampler
          </NavLink>
        </li>
        <li className="flex">
          <Button
            data-testid={NavbarTestIds.undoButton}
            aria-label="Undo"
            className={`hover:text-gray-300 ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onPress={soundActions.undo}
          >
            <Icon path={mdiUndo} size={1} title="Undo" />
          </Button>
        </li>
        <li className="flex">
          <Button
            data-testid={NavbarTestIds.redoButton}
            className={`hover:text-gray-300 ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onPress={soundActions.redo}
          >
            <Icon path={mdiRedo} size={1} title="Redo" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
