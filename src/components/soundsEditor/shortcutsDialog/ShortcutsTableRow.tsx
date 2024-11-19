import { ShortcutsDialogTestIds } from './ShortcutsDialogTestIds.ts'

interface TableRowProps {
  shortcut: string
  action: string
}

export const ShortcutsTableRow = ({ shortcut, action }: TableRowProps) => (
  <tr>
    <td
      className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
      data-testid={ShortcutsDialogTestIds.shortcut}
    >
      {shortcut}
    </td>
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{action}</td>
  </tr>
)
