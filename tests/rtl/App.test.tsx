import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { App } from '../../src/components/App'
import { MockAudioRecorder } from '../../src/tests/playwright/mocks/MockAudioRecorder'

test('has capture screen', async () => {
  render(<App audioRecorder={new MockAudioRecorder()} />)

  await userEvent.click(screen.getByText('Capture'))

  expect(screen.getByRole('button')).toBeEnabled()
})
