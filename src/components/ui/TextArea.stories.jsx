import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, FormField, TextArea } from './index';
import { ActionStatus, usePreviewValue } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 12 } },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    onChange: { table: { disable: true } },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A multiline native text field with the same label, hint, error, click-to-reveal helpText, and forwarded input props as TextField. It supports controlled and uncontrolled values, resizing, and FormField validation.' } },
  },
};
export default meta;

export const Playground = {
  args: {
    label: 'Report description',
    hint: 'Describe when administrators should use this report.',
    helpText: 'This description appears in the report catalog for administrators.',
    placeholder: 'Add a description…',
    rows: 4,
    value: '',
    disabled: false,
    readOnly: false,
    error: '',
  },
  render: PlaygroundExample,
  parameters: { docs: { source: { code: `const [description, setDescription] = useState('');
<TextArea
  label="Report description"
  hint="Describe when administrators should use this report."
  helpText="This description appears in the report catalog for administrators."
  rows={4}
  value={description}
  onChange={event => setDescription(event.target.value)}
/>` } } },
};

function PlaygroundExample(args) {
  const [value, setValue] = usePreviewValue(args.value);
  return <div><TextArea {...args} value={value} onChange={event => setValue(event.target.value)}/><ActionStatus>{value.length} characters</ActionStatus></div>;
}

export const Validation = {
  args: { label: 'Reason for change', defaultValue: 'Too short', rows: 3, error: 'Enter at least 20 characters' },
  parameters: { docs: { source: { code: `<TextArea label="Reason for change" defaultValue="Too short" error="Enter at least 20 characters" rows={3} />` } } },
};

export const Disabled = {
  args: { label: 'Policy notes', defaultValue: 'Only administrators can edit these notes.', disabled: true },
};

export const InValidatedForm = {
  render: () => <ValidatedExample/>,
  parameters: { docs: { source: { code: `const schema = z.object({ notes: z.string().trim().min(10, 'Enter at least 10 characters') });
const form = useForm({ resolver: zodResolver(schema), defaultValues: { notes: '' } });
<Form form={form} onSubmit={save}>
  <FormField name="notes" label="Policy notes" required render={({ field, inputProps }) =>
    <TextArea {...field} {...inputProps} rows={4} />
  } />
  <Button type="submit" variant="primary">Save notes</Button>
</Form>` } } },
};

function ValidatedExample() {
  const [status, setStatus] = useState('');
  const form = useForm({ resolver: zodResolver(z.object({ notes: z.string().trim().min(10, 'Enter at least 10 characters') })), defaultValues: { notes: '' } });
  return <div style={{ maxWidth: 620 }}>
    <Form form={form} onSubmit={values => setStatus(`Saved ${values.notes.length} characters`)} onInvalid={() => setStatus('Fix the highlighted field.')}>
      <FormField name="notes" label="Policy notes" required render={({ field, inputProps }) => <TextArea {...field} {...inputProps} rows={4} placeholder="Explain the policy…"/>}/>
      <div className="ad-form-actions"><Button type="submit" variant="primary">Save notes</Button></div>
    </Form>
    {status && <ActionStatus>{status}</ActionStatus>}
  </div>;
}
