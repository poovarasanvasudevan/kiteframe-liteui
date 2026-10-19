import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, FormField, PasswordInput, SelectField, Switch, TagInput, TextField } from './index';
import { ActionStatus } from '../../widgets/stories/StoryPreview';

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Schema validation with React Hook Form and Zod. Form supplies the form context and submit handler; FormField connects a named control to FormRow, labels, hints, and validation errors. The render prop works with native inputs and custom controls.' } },
  },
  argTypes: {
    mode: { control: 'select', options: ['onSubmit', 'onBlur', 'onChange'] },
    minPasswordLength: { control: { type: 'number', min: 1, max: 32 } },
    minTags: { control: { type: 'number', min: 0, max: 5 } },
    form: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    onInvalid: { table: { disable: true } },
    noValidate: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};
export default meta;

export const Playground = {
  args: { mode: 'onSubmit', minPasswordLength: 8, minTags: 1, requireAlerts: false },
  render: ValidationExample,
  parameters: { docs: { source: { code: `const schema = z.object({ server: z.string().trim().min(1, 'Enter a server name') });
const methods = useForm({ resolver: zodResolver(schema), defaultValues: { server: '' } });

<Form form={methods} onSubmit={saveSettings}>
  <FormField control={methods.control} name="server" label="Server name" required render={({ field, inputProps }) =>
    <TextField {...field} {...inputProps} placeholder="server.example.com" />
  } />
  <Button type="submit" variant="primary">Save settings</Button>
</Form>` } } },
};

function ValidationExample({ mode, minPasswordLength, minTags, requireAlerts }) {
  const [status, setStatus] = React.useState('Submit the form to validate every field.');
  const schema = React.useMemo(() => z.object({
    server: z.string().trim().min(1, 'Enter a server name'),
    email: z.string().min(1, 'Enter an email address').email('Enter a valid email address'),
    password: z.string().min(minPasswordLength, `Use at least ${minPasswordLength} characters`),
    directory: z.string().min(1, 'Choose a directory'),
    alerts: z.boolean().refine(value => !requireAlerts || value, 'Enable alerts to continue'),
    tags: z.array(z.string()).min(minTags, `Add at least ${minTags} tag${minTags === 1 ? '' : 's'}`),
  }), [minPasswordLength, minTags, requireAlerts]);
  const form = useForm({
    resolver: zodResolver(schema),
    mode,
    defaultValues: { server: '', email: '', password: '', directory: '', alerts: false, tags: [] },
  });

  return <div style={{ width: 620, maxWidth: '100%' }}>
    <Form form={form} onSubmit={values => setStatus(`Saved ${values.server} settings`)} onInvalid={() => setStatus('Fix the highlighted fields and try again.')}>
      <FormField name="server" label="Server name" required hint="The host name used by the administrator console" render={({ field, inputProps }) => <TextField {...field} {...inputProps} placeholder="server.example.com"/>}/>
      <FormField name="email" label="Admin email" required render={({ field, inputProps }) => <TextField {...field} {...inputProps} type="email" placeholder="admin@example.com"/>}/>
      <FormField name="password" label="Service password" required render={({ field, inputProps }) => <PasswordInput {...field} {...inputProps} autoComplete="new-password" placeholder="Enter password"/>}/>
      <FormField name="directory" label="Directory" required render={({ field, inputProps }) => <SelectField {...field} {...inputProps} options={[{ value: '', label: 'Choose a directory' }, { value: 'ADSELF', label: 'ADSELF' }, { value: 'DEMO', label: 'DEMO' }]}/>}/>
      <FormField name="alerts" label="Report alerts" required={requireAlerts} render={({ field, inputProps }) => <Switch {...inputProps} name={field.name} checked={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>}/>
      <FormField name="tags" label="Report tags" required={minTags > 0} hint="Press Enter or comma to add a tag" render={({ field, inputProps }) => <TagInput {...inputProps} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} placeholder="Add a tag"/>}/>
      <div className="ad-form-actions"><Button type="submit" variant="primary">Save settings</Button><Button onClick={() => { form.reset(); setStatus('Form reset.'); }}>Reset</Button></div>
    </Form>
    <ActionStatus>{status}</ActionStatus>
  </div>;
}
