import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button, ButtonVariant } from '../components/shared/Button.tsx'
import { mdiTrashCan } from '@mdi/js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: 'select',
      options: [ButtonVariant.PRIMARY, ButtonVariant.ORDINARY, ButtonVariant.DANGEROUS],
      description: 'The variant of the button',
    },
    icon: {
      control: 'select',
      options: [mdiTrashCan],
      description: 'An icon to use with the button',
    },
    testId: {
      table: {
        disable: true,
      },
    },
    // variant: { control: 'color' },
  },
  args: { onPress: fn(), label: 'Button' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: ButtonVariant.PRIMARY,
  },
}

export const Ordinary: Story = {
  args: {
    variant: ButtonVariant.ORDINARY,
  },
}

export const Dangerous: Story = {
  args: {
    variant: ButtonVariant.DANGEROUS,
  },
}
