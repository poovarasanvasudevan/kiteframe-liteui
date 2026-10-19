import React, { useState } from 'react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { ActionStatus, usePreviewValue } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object' },
    value: { control: 'text' },
    ariaLabel: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    onChange: { table: { disable: true } },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A connected, single-select group of native radio controls. Use value and onChange for controlled state, or defaultValue for local state. Options can be strings or objects with value, label, and disabled. Arrow keys move between enabled choices; name and required work with HTML forms.' } },
  },
};
export default meta;

export const Playground = {
  args: {
    options: [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ],
    value: 'weekly',
    ariaLabel: 'Report frequency',
    name: 'frequency',
    disabled: false,
    required: false,
  },
  render: PlaygroundExample,
  parameters: { docs: { source: { code: `const [frequency, setFrequency] = useState('weekly');
<ButtonGroup
  options={[
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ]}
  value={frequency}
  onChange={setFrequency}
  name="frequency"
  ariaLabel="Report frequency"
/>` } } },
};

function PlaygroundExample(args) {
  const [value, setValue] = usePreviewValue(args.value);
  return <div><ButtonGroup {...args} value={value} onChange={setValue}/><ActionStatus>Selected: {value || 'none'}</ActionStatus></div>;
}

export const Uncontrolled = {
  args: { options: ['Day', 'Week', 'Month'], defaultValue: 'Week', ariaLabel: 'Date range' },
  parameters: { docs: { source: { code: `<ButtonGroup options={['Day', 'Week', 'Month']} defaultValue="Week" ariaLabel="Date range" />` } } },
};

export const DisabledOption = {
  args: {
    options: [
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
      { value: 'chart', label: 'Chart', disabled: true },
    ],
    defaultValue: 'list',
    ariaLabel: 'Display mode',
  },
  parameters: { docs: { source: { code: `<ButtonGroup options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'chart', label: 'Chart', disabled: true }]} defaultValue="list" ariaLabel="Display mode" />` } } },
};

export const InForm = {
  render: () => <FormExample/>,
  parameters: { docs: { source: { code: `<form onSubmit={handleSubmit}>
  <ButtonGroup options={['Today', '7 days', '30 days']} defaultValue="7 days" name="range" ariaLabel="Report range" required />
  <Button type="submit" variant="primary">Apply</Button>
</form>` } } },
};

function FormExample() {
  const [submitted, setSubmitted] = useState('');
  return <form onSubmit={event => { event.preventDefault(); setSubmitted(new FormData(event.currentTarget).get('range')); }}>
    <ButtonGroup options={['Today', '7 days', '30 days']} defaultValue="7 days" name="range" ariaLabel="Report range" required/>
    <Button variant="primary" type="submit" style={{ marginLeft: 12 }}>Apply</Button>
    {submitted && <ActionStatus>Applied: {submitted}</ActionStatus>}
  </form>;
}
