import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';

const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
};
export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = { args: { label: 'Amount', value: '' } };
export const WithError: Story = { args: { label: 'Amount', value: '', error: 'This field is required' } };
export const Filled: Story = { args: { label: 'Amount', value: '100' } };
