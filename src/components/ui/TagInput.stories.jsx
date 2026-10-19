import React from 'react';
import { TagInput } from './TagInput';
import { ActionStatus, usePreviewValue } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  argTypes: { hint: { control: 'text' }, error: { control: 'text' }, onChange: { table: { disable: true } }, removeLabel: { table: { disable: true } } },
  parameters: { layout: 'padded', docs: { description: { component: 'Add tags with Enter or comma, paste a comma or newline separated list, and remove tags with Backspace or the remove button. Use value and onChange for controlled usage, or defaultValue for local state.' } } },
};
export default meta;

export const Playground = {
  args: { label: 'Allowed domains', value: ['Production', 'Staging'], placeholder: 'Add a domain', hint: 'Press Enter or comma to add a domain', error: '', maxTags: 5, allowDuplicates: false, addOnBlur: false, disabled: false, readOnly: false },
  argTypes: { defaultValue: { table: { disable: true } } },
  render: PlaygroundExample,
  parameters: { docs: { source: { code: `<TagInput label="Allowed domains" defaultValue={['Production', 'Staging']} placeholder="Add a domain" onChange={tags => console.log(tags)} />` } } },
};

function PlaygroundExample(args) {
  const [tags, setTags] = usePreviewValue(args.value);
  return <div style={{ width: 400, maxWidth: '100%' }}><TagInput {...args} value={tags} onChange={setTags}/><ActionStatus>Tags: {tags.join(', ') || 'none'}</ActionStatus></div>;
}

export const Validation = {
  args: { label: 'Recipients', defaultValue: ['admin@example.com'], placeholder: 'Add recipient', error: 'Add at least two recipients' },
  render: args => <div style={{ width: 400, maxWidth: '100%' }}><TagInput {...args}/></div>,
};

export const Disabled = {
  args: { label: 'Locked categories', defaultValue: ['Security', 'Audit'], disabled: true },
  render: args => <div style={{ width: 400, maxWidth: '100%' }}><TagInput {...args}/></div>,
};
