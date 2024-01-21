import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { App } from './components/App'

test('has capture screen', async () => {
  render(<App />)

  await userEvent.click(screen.getByText('Capture'))

  expect(screen.getByRole('button')).toBeEnabled()
})
