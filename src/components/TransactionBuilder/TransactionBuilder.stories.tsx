import type { Meta, StoryObj } from '@storybook/react';
import { TransactionBuilder } from './TransactionBuilder';

const meta: Meta<typeof TransactionBuilder> = {
  title: 'TransactionBuilder',
  component: TransactionBuilder,
};
export default meta;
type Story = StoryObj<typeof TransactionBuilder>;

export const Testnet: Story = { args: { network: 'testnet' } };
export const Mainnet: Story = { args: { network: 'mainnet' } };
export const PreFilled: Story = {
  args: { network: 'testnet', sourceAccount: 'GABC…' },
};
