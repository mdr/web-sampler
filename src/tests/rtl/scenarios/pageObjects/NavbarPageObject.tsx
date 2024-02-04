import { PageObject } from './PageObject.tsx'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { NavbarTestIds } from '../../../../components/NavbarTestIds.ts'
import { EditSoundPageObject } from './EditSoundPageObject.tsx'

export class NavbarPageObject extends PageObject {
  clickCapture = async (): Promise<EditSoundPageObject> => {
    await userEvent.click(screen.getByTestId(NavbarTestIds.capture))
    return new EditSoundPageObject(this.testContext)
  }
}
