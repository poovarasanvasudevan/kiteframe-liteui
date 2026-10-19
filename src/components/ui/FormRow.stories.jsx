import React from 'react';
import { FormRow, TextField } from './index';

const meta = {
  title: 'Components/FormRow',
  component: FormRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A label and control layout with optional hint or error. Use htmlFor and matching control id for accessibility. For schema validation, use FormField inside Form.' } } },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    htmlFor: { table: { disable: true } },
    hintId: { table: { disable: true } },
    errorId: { table: { disable: true } },
    children: { table: { disable: true } },
  },
};
export default meta;

export const Playground = {
  args: { label: 'Server name', required: true, hint: 'The host name used by the administrator console', error: '' },
  render: args => <FormRow {...args} htmlFor="formrow-server" hintId="formrow-server-hint" errorId="formrow-server-error">
    <TextField id="formrow-server" placeholder="server.example.com" aria-invalid={!!args.error} aria-required={args.required} aria-describedby={args.error ? 'formrow-server-error' : args.hint ? 'formrow-server-hint' : undefined}/>
  </FormRow>,
};

export const ValidationError = {
  args: { label: 'Server name', required: true, error: 'Enter a server name' },
  render: args => <FormRow {...args} htmlFor="formrow-error" errorId="formrow-error-message"><TextField id="formrow-error" aria-invalid aria-required aria-describedby="formrow-error-message"/></FormRow>,
};
