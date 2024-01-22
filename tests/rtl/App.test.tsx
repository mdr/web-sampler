import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { App } from '../../src/components/App'
import { defaultAudioRecorderFactory } from '../../src/audio/AudioRecorder'

test('has capture screen', async () => {
  render(<App audioRecorderFactory={defaultAudioRecorderFactory} />)

  await userEvent.click(screen.getByText('Capture'))

  expect(screen.getByRole('button')).toBeEnabled()
})
