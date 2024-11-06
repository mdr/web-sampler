import { isMacOs } from '../../../utils/browserUtils.ts'
import { TableHeader } from './TableHeader.tsx'
import { TableRow } from './TableRow.tsx'

export const ShortcutTable = () => {
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
