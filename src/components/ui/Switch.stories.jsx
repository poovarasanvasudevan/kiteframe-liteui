import React from 'react';
import { Switch } from './Switch';
import { ActionStatus, usePreviewValue } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    onChange: { table: { disable: true } },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A native checkbox presented as a switch. Use checked and onChange for controlled state, or defaultChecked for local state. Name and value work with HTML forms.' } },
  },
};
export default meta;

export const Playground = {
  args: {
    label: 'Enable notifications',
    description: 'Send updates when a report is ready.',
    checked: false,
    disabled: false,
    size: 'md',
    name: 'notifications',
    value: 'enabled',
  },
  render: PlaygroundExample,
  parameters: { docs: { source: { code: `const [enabled, setEnabled] = useState(false);\n<Switch label="Enable notifications" description="Send updates when a report is ready." checked={enabled} onChange={setEnabled} />` } } },
};

function PlaygroundExample(args) {
  const [checked, setChecked] = usePreviewValue(args.checked);
  return <div><Switch {...args} checked={checked} onChange={setChecked}/><ActionStatus>Notifications {checked ? 'on' : 'off'}</ActionStatus></div>;
}

export const Uncontrolled = {
  args: { label: 'Allow password reset', defaultChecked: true, name: 'passwordReset', value: 'enabled' },
  parameters: { docs: { source: { code: `<Switch label="Allow password reset" name="passwordReset" value="enabled" defaultChecked />` } } },
};

export const Small = {
  args: { label: 'Compact switch', size: 'sm', defaultChecked: true },
};

export const Disabled = {
  args: { label: 'Unavailable setting', description: 'An administrator must enable this feature.', disabled: true },
};
