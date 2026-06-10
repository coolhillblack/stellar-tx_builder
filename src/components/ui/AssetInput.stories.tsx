import type { Meta, StoryObj } from '@storybook/react';
import { AssetInput } from './AssetInput';

const meta: Meta<typeof AssetInput> = {
  title: 'UI/AssetInput',
  component: AssetInput,
};
export default meta;
type Story = StoryObj<typeof AssetInput>;

export const Default: Story = { args: {} };
