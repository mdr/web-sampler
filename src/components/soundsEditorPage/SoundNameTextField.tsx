import { Input, Label, TextField } from 'react-aria-components'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'

export interface SoundNameTextFieldProps {
  soundName: string
  setSoundName: (soundName: string) => void
}

export const SoundNameTextField = ({ soundName, setSoundName }: SoundNameTextFieldProps) => (
  <TextField className="flex flex-col space-y-2 p-4">
    <Label className="font-medium text-gray-700">Sound Name</Label>
    <Input
      data-testid={EditSoundPaneTestIds.soundNameInput}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      value={soundName}
      placeholder="Enter sound name"
      onChange={(e) => setSoundName(e.target.value)}
      data-1p-ignore
    />
  </TextField>
)
