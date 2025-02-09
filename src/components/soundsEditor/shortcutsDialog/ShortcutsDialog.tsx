import { Dialog } from 'react-aria-components'

import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { ShortcutsDialogTestIds } from './ShortcutsDialogTestIds.ts'
import { ShortcutsTable } from './ShortcutsTable.tsx'

export const ShortcutsDialog = () => (
  <Dialog data-testid={ShortcutsDialogTestIds.dialog} aria-label="Shortcuts" className="relative outline-hidden">
    {({ close }) => (
      <div>
        <ShortcutsTable />
        <div className="mt-6 flex justify-end">
          <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
        </div>
      </div>
    )}
  </Dialog>
)
