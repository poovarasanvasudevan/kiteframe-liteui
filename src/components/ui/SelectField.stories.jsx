import { SelectField } from './index';

const meta = {
  title: 'Components/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: { helpText: { control: 'text' } },
  parameters: { layout: 'padded', docs: { description: { component: 'Native select control with a connected label, optional hint, validation message, and click-to-reveal helpText.' } } },
};
export default meta;

export const Playground = {
  args: { label: 'Backup frequency', options: ['Daily', 'Weekly', 'Monthly'], defaultValue: 'Weekly', helpText: 'Choose how often the backup task runs.' },
  parameters: { docs: { source: { code: `<SelectField label="Backup frequency" options={['Daily', 'Weekly', 'Monthly']} defaultValue="Weekly" helpText="Choose how often the backup task runs." />` } } },
};
export const Validation = {
  args: { label: 'Directory', options: ['Choose a directory', 'ADSELF'], error: 'Choose a directory' },
};
export const Disabled = {
  args: { label: 'Directory', options: ['ADSELF'], disabled: true },
};
