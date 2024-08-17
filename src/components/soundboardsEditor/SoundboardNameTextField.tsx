import InlineEdit from '@atlaskit/inline-edit'
import { Input, TextField } from 'react-aria-components'

import { soundboardNameAsDisplayName } from '../../types/Soundboard.ts'
import { EditSoundboardPaneTestIds } from './editSoundboardPane/EditSoundboardPaneTestIds.ts'

export interface SoundboardNameTextFieldProps {
  name: string
  setName: (name: string) => void
}

export const SoundboardNameTextField = ({ name, setName }: SoundboardNameTextFieldProps) => (
  <InlineEdit
    readViewFitContainerWidth
    defaultValue={name}
    editView={({ value, onChange }) => (
      // my-[2px] - to avoid jitter when switching from read to edit view
      <TextField aria-label="Soundboard name" className="my-[2px] flex flex-col space-y-2">
        <Input
          data-testid={EditSoundboardPaneTestIds.soundboardNameInput}
          className="block w-full rounded-md border border-gray-300 px-3 text-2xl shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          value={value}
          autoFocus
          placeholder="Enter soundboard name"
          onChange={(e) => onChange(e.target.value)}
          data-1p-ignore
        />
      </TextField>
    )}
    readView={() => (
      <h1 data-testid={EditSoundboardPaneTestIds.soundboardNameInput} className="text-2xl">
        {soundboardNameAsDisplayName(name)}
      </h1>
    )}
    onConfirm={setName}
  />
)
