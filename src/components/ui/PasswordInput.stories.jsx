import React from 'react';
import { PasswordInput } from './PasswordInput';
import { ActionStatus, usePreviewValue } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/PasswordInput',
  component: PasswordInput,
  tags: ['autodocs'],
  argTypes: { hint: { control: 'text' }, error: { control: 'text' }, onVisibilityChange: { table: { disable: true } } },
  parameters: { layout: 'padded', docs: { description: { component: 'A password field with an accessible eye button. Toggle visibility without changing the input value. Use visible and onVisibilityChange for controlled visibility, or defaultVisible for local state.' } } },
};
export default meta;

export const Playground = {
  args: { label: 'Administrator password', placeholder: 'Enter password', hint: 'Use the eye button to review your entry', error: '', visible: false, showToggle: true, disabled: false, readOnly: false, showPasswordLabel: 'Show password', hidePasswordLabel: 'Hide password' },
  argTypes: { defaultVisible: { table: { disable: true } } },
  render: PlaygroundExample,
  parameters: { docs: { source: { code: '<PasswordInput label="Administrator password" placeholder="Enter password" autoComplete="current-password" />' } } },
};

function PlaygroundExample(args) {
  const [visible, setVisible] = usePreviewValue(args.visible);
  return <div style={{ width: 320, maxWidth: '100%' }}><PasswordInput {...args} visible={visible} onVisibilityChange={setVisible}/><ActionStatus>Password {visible ? 'visible' : 'hidden'}</ActionStatus></div>;
}

export const Validation = {
  args: { label: 'New password', placeholder: 'Enter a new password', autoComplete: 'new-password', error: 'Enter a password' },
  render: args => <div style={{ width: 320, maxWidth: '100%' }}><PasswordInput {...args}/></div>,
};

export const Disabled = {
  args: { label: 'Password', placeholder: 'Unavailable', disabled: true },
  render: args => <div style={{ width: 320, maxWidth: '100%' }}><PasswordInput {...args}/></div>,
};
