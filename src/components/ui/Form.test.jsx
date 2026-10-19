import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, FormField, FormRow, PasswordInput, SelectField, Switch, TagInput, TextField } from './index';

test('schema errors appear in FormRow, describe inputs, focus the first error, and block submit', async () => {
  const onSubmit = jest.fn();
  const schema = z.object({ email: z.string().email('Enter a valid email address'), password: z.string().min(8, 'Use at least 8 characters') });
  function Example() {
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });
    return <Form form={form} onSubmit={onSubmit}>
      <FormField name="email" label="Admin email" required hint="Used for reports" render={({ field, inputProps }) => <TextField {...field} {...inputProps} type="email"/>}/>
      <FormField name="password" label="Password" required render={({ field, inputProps }) => <PasswordInput {...field} {...inputProps}/>}/>
      <Button type="submit">Save</Button>
    </Form>;
  }
  render(<Example/>);
  const email = screen.getByRole('textbox', { name: 'Admin email' });
  expect(email).toHaveAccessibleDescription('Used for reports');
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
  expect(email).toHaveAttribute('aria-invalid', 'true');
  expect(email).toHaveAccessibleDescription('Enter a valid email address');
  expect(email).toHaveFocus();
  expect(screen.getByLabelText(/Password/)).toHaveAttribute('aria-invalid', 'true');
  expect(onSubmit).not.toHaveBeenCalled();
  fireEvent.change(email, { target: { value: 'admin@example.com' } });
  fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'secure-passphrase' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: 'admin@example.com', password: 'secure-passphrase' }, expect.anything()));
});

test('select, switch, and tag input participate in the same schema', async () => {
  const onSubmit = jest.fn();
  const schema = z.object({
    directory: z.string().min(1, 'Choose a directory'),
    alerts: z.boolean().refine(Boolean, 'Enable alerts'),
    tags: z.array(z.string()).min(1, 'Add a report tag'),
  });
  function Example() {
    const form = useForm({ resolver: zodResolver(schema), defaultValues: { directory: '', alerts: false, tags: [] } });
    return <Form form={form} onSubmit={onSubmit}>
      <FormField name="directory" label="Directory" render={({ field, inputProps }) => <SelectField {...field} {...inputProps} options={[{ value: '', label: 'Choose' }, { value: 'ADSELF', label: 'ADSELF' }]}/>}/>
      <FormField name="alerts" label="Report alerts" render={({ field, inputProps }) => <Switch {...inputProps} name={field.name} checked={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>}/>
      <FormField name="tags" label="Report tags" render={({ field, inputProps }) => <TagInput {...inputProps} name={field.name} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref}/>}/>
      <Button type="submit">Save</Button>
    </Form>;
  }
  render(<Example/>);
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('Choose a directory')).toBeInTheDocument();
  expect(screen.getByRole('switch', { name: 'Report alerts' })).toHaveAccessibleDescription('Enable alerts');
  expect(screen.getByRole('textbox', { name: 'Report tags' })).toHaveAccessibleDescription('Add a report tag');
  expect(screen.getByRole('textbox', { name: 'Report tags' })).toHaveAttribute('aria-invalid', 'true');
  expect(onSubmit).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole('combobox', { name: 'Directory' }), { target: { value: 'ADSELF' } });
  fireEvent.click(screen.getByRole('switch', { name: 'Report alerts' }));
  const tags = screen.getByRole('textbox', { name: 'Report tags' });
  fireEvent.change(tags, { target: { value: 'Security' } });
  fireEvent.keyDown(tags, { key: 'Enter' });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ directory: 'ADSELF', alerts: true, tags: ['Security'] }, expect.anything()));
});

test('FormRow keeps standalone layouts compatible and links explicit errors', () => {
  render(<FormRow label="Host" htmlFor="host" error="Enter a host" errorId="host-error"><TextField id="host" aria-invalid aria-describedby="host-error"/></FormRow>);
  const input = screen.getByRole('textbox', { name: 'Host' });
  expect(input).toHaveAccessibleDescription('Enter a host');
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a host');
});
