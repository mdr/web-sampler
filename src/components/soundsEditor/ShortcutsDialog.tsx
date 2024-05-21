import { Dialog } from 'react-aria-components'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'
import { FC } from 'react'
import { isMacOs } from '../../utils/browserUtils.ts'

export interface ShortcutsWarningDialogProps {
  close: () => void
}

const TableHeader: FC = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
          Shortcut
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
          Action
        </th>
      </tr>
    </thead>
  )
}

interface TableRowProps {
  shortcut: string
  action: string
}

const TableRow: FC<TableRowProps> = ({ shortcut, action }) => {
  return (
    <tr>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{shortcut}</td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{action}</td>
    </tr>
  )
}

const ShortcutTable: FC = () => {
  const shortcuts = [
    { key: 'Space', action: 'Toggle play/pause' },
    { key: '←', action: 'Large seek back' },
    { key: '⇧ + ←', action: 'Small seek back' },
    { key: '→', action: 'Large seek forward' },
    { key: '⇧ + →', action: 'Small seek forward' },
    { key: 's', action: 'Mark start' },
    { key: 'f', action: 'Mark finish' },
    { key: isMacOs() ? '⌘ + Z' : '⌃ + Z', action: 'Undo' },
    { key: isMacOs() ? '⌘ + ⇧ + Z' : '⌃ + Y', action: 'Redo' },
  ]

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <TableHeader />
      <tbody className="divide-y divide-gray-200 bg-white">
        {shortcuts.map((shortcut, index) => (
          <TableRow key={index} shortcut={shortcut.key} action={shortcut.action} />
        ))}
      </tbody>
    </table>
  )
}

export const ShortcutsWarningDialog = ({ close }: ShortcutsWarningDialogProps) => {
  return (
    <Dialog aria-label="Shortcuts" className="relative outline-none">
      <ShortcutTable />
      <div className="mt-6 flex justify-end">
        <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
      </div>
    </Dialog>
  )
}
