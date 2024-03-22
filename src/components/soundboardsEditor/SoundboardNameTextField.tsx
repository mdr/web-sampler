import { Input, Label, TextField } from 'react-aria-components'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'

export interface SoundboardNameTextFieldProps {
  name: string
  setName: (soundName: string) => void
}

export const SoundboardNameTextField = ({ name, setName }: SoundboardNameTextFieldProps) => (
  <TextField className="flex flex-col space-y-2">
    <Label className="font-medium text-gray-700">Soundboard Name</Label>
    <Input
      data-testid={EditSoundboardPaneTestIds.soundNameInput}
      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      value={name}
      placeholder="Enter soundboard name"
      onChange={(e) => setName(e.target.value)}
      data-1p-ignore
    />
  </TextField>
)
