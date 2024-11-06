import { Dialog } from 'react-aria-components'

import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { ShortcutTable } from './ShortcutTable.tsx'

export const ShortcutsDialog = () => (
  <Dialog aria-label="Shortcuts" className="relative outline-none">
    {({ close }) => (
      <div>
        <ShortcutTable />
        <div className="mt-6 flex justify-end">
          <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
        </div>
      </div>
    )}
  </Dialog>
)
