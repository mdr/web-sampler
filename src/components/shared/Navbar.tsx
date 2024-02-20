import { NavLink } from 'react-router-dom'
import { mdiRedo, mdiUndo } from '@mdi/js'
import Icon from '@mdi/react'
import { Button as RacButton } from 'react-aria-components'
import { useCanRedo, useCanUndo, useSoundActions } from '../../sounds/soundHooks.ts'
import { NavbarTestIds } from './NavbarTestIds.ts'
import { useHotkeys } from 'react-hotkeys-hook'
import clsx from 'clsx'
import { StorageWarningButton } from './StorageWarningButton.tsx'

const showWarning = true

export const Navbar = () => {
  const soundActions = useSoundActions()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
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
          <RacButton
            data-testid={NavbarTestIds.undoButton}
            aria-label="Undo"
            className={clsx('hover:text-gray-300', { 'cursor-not-allowed opacity-50': !canUndo })}
            onPress={soundActions.undo}
          >
            <Icon path={mdiUndo} size={1} title="Undo" />
          </RacButton>
        </li>
        <li className="flex">
          <RacButton
            data-testid={NavbarTestIds.redoButton}
            aria-label="Redo"
            className={clsx('hover:text-gray-300', { 'cursor-not-allowed opacity-50': !canRedo })}
            onPress={soundActions.redo}
          >
            <Icon path={mdiRedo} size={1} title="Redo" />
          </RacButton>
        </li>
        <div className="flex-grow" />
        {showWarning && (
          <li>
            <StorageWarningButton />
          </li>
        )}
      </ul>
    </nav>
  )
}
