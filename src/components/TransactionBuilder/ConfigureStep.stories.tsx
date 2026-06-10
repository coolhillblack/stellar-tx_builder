import type { Meta, StoryObj } from '@storybook/react';
import { ConfigureStep } from './ConfigureStep';

const meta: Meta<typeof ConfigureStep> = {
  title: 'Steps/ConfigureStep',
  component: ConfigureStep,
};
export default meta;
type Story = StoryObj<typeof ConfigureStep>;

export const Default: Story = { args: {} };
