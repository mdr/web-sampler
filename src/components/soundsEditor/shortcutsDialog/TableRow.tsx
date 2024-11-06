interface TableRowProps {
  shortcut: string
  action: string
}

export const TableRow = ({ shortcut, action }: TableRowProps) => (
  <tr>
    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{shortcut}</td>
    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{action}</td>
  </tr>
)
