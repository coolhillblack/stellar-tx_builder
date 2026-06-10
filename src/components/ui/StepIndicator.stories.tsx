import type { Meta, StoryObj } from '@storybook/react';
import { StepIndicator } from './StepIndicator';

const meta: Meta<typeof StepIndicator> = {
  title: 'UI/StepIndicator',
  component: StepIndicator,
};
export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const Step1: Story = { args: { currentStep: 1 } };
export const Step3: Story = { args: { currentStep: 3 } };
export const Step5: Story = { args: { currentStep: 5 } };
