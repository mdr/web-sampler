import InlineEdit from '@atlaskit/inline-edit'
import { Input, TextField } from 'react-aria-components'

import { soundNameAsDisplayName } from '../../../types/Sound.ts'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export interface SoundNameTextFieldProps {
  name: string
  setName: (name: string) => void
}

export const SoundNameTextField = ({ name, setName }: SoundNameTextFieldProps) => (
  <InlineEdit
    readViewFitContainerWidth
    defaultValue={name}
    editView={({ value, onChange }) => (
      // my-[2px] - to avoid jitter when switching from read to edit view
      <TextField aria-label="Sound name" className="my-[2px] flex flex-col space-y-2">
        <Input
          data-testid={EditSoundPaneTestIds.soundNameInput}
          className="block w-full rounded-md border border-gray-300 px-3 text-2xl shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          value={value}
          autoFocus
          placeholder="Enter sound name"
          onChange={(e) => onChange(e.target.value)}
          data-1p-ignore
        />
      </TextField>
    )}
    readView={() => (
      <h1 data-testid={EditSoundPaneTestIds.soundNameInput} className="text-2xl">
        {soundNameAsDisplayName(name)}
      </h1>
    )}
    onConfirm={setName}
  />
)
