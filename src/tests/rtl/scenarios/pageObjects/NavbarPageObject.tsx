import { PageObject } from './PageObject.tsx'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { NavbarTestIds } from '../../../../components/NavbarTestIds.ts'
import { CapturePageObject } from './CapturePageObject.tsx'

export class NavbarPageObject extends PageObject {
  clickCapture = async (): Promise<CapturePageObject> => {
    await userEvent.click(screen.getByTestId(NavbarTestIds.capture))
    return new CapturePageObject(this.testContext)
  }
}
