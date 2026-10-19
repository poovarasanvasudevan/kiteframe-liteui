import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button, ButtonGroup, DataTable, Modal, PasswordInput, SelectField, Switch, Tabs, TagInput, TextArea, TextField } from './index';

test.each([
  ['TextField', TextField, 'textbox', {}],
  ['TextArea', TextArea, 'textbox', {}],
  ['SelectField', SelectField, 'combobox', { options: ['Daily', 'Weekly'] }],
])('%s reveals and hides help without submitting a form', (_name, Component, role, extraProps) => {
  const onSubmit = jest.fn(event => event.preventDefault());
  const { container } = render(<form onSubmit={onSubmit}><Component label="Backup schedule" hint="Choose a value" helpText="Runs at midnight" {...extraProps}/></form>);
  const input = screen.getByRole(role, { name: 'Backup schedule' });
  const toggle = screen.getByRole('button', { name: 'Help for Backup schedule' });
  const help = container.querySelector('.ad-field-help-text');
  expect(toggle).toHaveAttribute('type', 'button');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(help).not.toBeVisible();
  expect(input).toHaveAccessibleDescription('Choose a value');
  fireEvent.click(toggle);
  expect(onSubmit).not.toHaveBeenCalled();
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(help).toBeVisible();
  expect(input).toHaveAccessibleDescription('Choose a value Runs at midnight');
  fireEvent.click(toggle);
  expect(help).not.toBeVisible();
  expect(input).toHaveAccessibleDescription('Choose a value');
});

test('button group selects one option and submits its value', () => {
  const onChange = jest.fn();
  const { container } = render(<form><ButtonGroup options={['Day', 'Week', 'Month']} defaultValue="Week" name="range" ariaLabel="Report range" onChange={onChange}/></form>);
  expect(screen.getByRole('radiogroup', { name: 'Report range' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'Week' })).toBeChecked();
  fireEvent.click(screen.getByRole('radio', { name: 'Month' }));
  expect(screen.getByRole('radio', { name: 'Month' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Week' })).not.toBeChecked();
  expect(onChange).toHaveBeenCalledWith('Month', { value: 'Month', label: 'Month' });
  expect(new FormData(container.querySelector('form')).get('range')).toBe('Month');
});

test('button group respects controlled value and disabled options', () => {
  const onChange = jest.fn();
  const options = [{ value: 'list', label: 'List' }, { value: 'chart', label: 'Chart', disabled: true }, { value: 'grid', label: 'Grid' }];
  const { rerender } = render(<ButtonGroup options={options} value="list" onChange={onChange} ariaLabel="View"/>);
  fireEvent.click(screen.getByRole('radio', { name: 'Grid' }));
  expect(onChange).toHaveBeenCalledWith('grid', options[2]);
  expect(screen.getByRole('radio', { name: 'List' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Chart' })).toBeDisabled();
  fireEvent.click(screen.getByRole('radio', { name: 'Chart' }));
  expect(onChange).toHaveBeenCalledTimes(1);
  rerender(<ButtonGroup options={options} value="grid" onChange={onChange} ariaLabel="View" disabled/>);
  expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked();
  expect(screen.getAllByRole('radio').every(input => input.disabled)).toBe(true);
});

test('field errors are connected to their input', () => {
  render(<TextField label="Server address" error="Enter a server address"/>);
  const field = screen.getByRole('textbox', { name: 'Server address' });
  expect(field).toHaveAttribute('aria-invalid', 'true');
  expect(field).toHaveAccessibleDescription('Enter a server address');
});

test('text area accepts multiline input and connects its hint and error', () => {
  const { rerender } = render(<TextArea label="Policy notes" name="notes" rows={5} hint="Explain the exception" defaultValue="First line"/>);
  const input = screen.getByRole('textbox', { name: 'Policy notes' });
  expect(input).toHaveAttribute('rows', '5');
  expect(input).toHaveAccessibleDescription('Explain the exception');
  fireEvent.change(input, { target: { value: 'First line\nSecond line' } });
  expect(input).toHaveValue('First line\nSecond line');
  rerender(<TextArea label="Policy notes" name="notes" rows={5} error="Enter more detail" value="First line\nSecond line" onChange={() => {}}/>);
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription('Enter more detail');
});

test('password eye button toggles visibility without changing the value', () => {
  render(<PasswordInput label="Password" defaultValue="secret-value"/>);
  const input = screen.getByLabelText('Password');
  expect(input).toHaveAttribute('type', 'password');
  const show = screen.getByRole('button', { name: 'Show password' });
  fireEvent.click(show);
  expect(input).toHaveAttribute('type', 'text');
  expect(input).toHaveValue('secret-value');
  expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(input).toHaveAttribute('type', 'password');
});

test('controlled password visibility reports changes and connects its error', () => {
  const onVisibilityChange = jest.fn();
  const { rerender } = render(<PasswordInput label="New password" visible={false} onVisibilityChange={onVisibilityChange} error="Enter a password"/>);
  const input = screen.getByLabelText('New password');
  expect(input).toHaveAccessibleDescription('Enter a password');
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(onVisibilityChange).toHaveBeenCalledWith(true);
  expect(input).toHaveAttribute('type', 'password');
  rerender(<PasswordInput label="New password" visible onVisibilityChange={onVisibilityChange} error="Enter a password"/>);
  expect(input).toHaveAttribute('type', 'text');
});

test('switch toggles with an accessible label and submits its native value', () => {
  const onChange = jest.fn();
  const { container } = render(<form><Switch label="Enable notifications" description="Send report updates" name="notifications" value="enabled" onChange={onChange}/></form>);
  const control = screen.getByRole('switch', { name: 'Enable notifications' });
  expect(control).toHaveAccessibleDescription('Send report updates');
  expect(control).not.toBeChecked();
  fireEvent.click(control);
  expect(control).toBeChecked();
  expect(onChange).toHaveBeenCalledWith(true);
  expect(new FormData(container.querySelector('form')).get('notifications')).toBe('enabled');
});

test('controlled and disabled switches respect their props', () => {
  const onChange = jest.fn();
  const { rerender } = render(<Switch label="Security alerts" checked={false} onChange={onChange}/>);
  const control = screen.getByRole('switch', { name: 'Security alerts' });
  fireEvent.click(control);
  expect(onChange).toHaveBeenCalledWith(true);
  expect(control).not.toBeChecked();
  rerender(<Switch label="Security alerts" checked disabled onChange={onChange}/>);
  expect(control).toBeChecked();
  fireEvent.click(control);
  expect(onChange).toHaveBeenCalledTimes(1);
});

test('tag input adds, deduplicates, and removes tags from the keyboard', () => {
  const onChange = jest.fn();
  render(<TagInput label="Labels" defaultValue={['Blue']} onChange={onChange}/>);
  const input = screen.getByRole('textbox', { name: 'Labels' });
  fireEvent.change(input, { target: { value: 'Green' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(screen.getByRole('button', { name: 'Remove Green' })).toBeInTheDocument();
  expect(onChange).toHaveBeenLastCalledWith(['Blue', 'Green']);
  fireEvent.change(input, { target: { value: 'blue' } });
  fireEvent.keyDown(input, { key: ',' });
  expect(screen.getAllByRole('button', { name: /Remove Blue/i })).toHaveLength(1);
  fireEvent.keyDown(input, { key: 'Backspace' });
  expect(screen.queryByRole('button', { name: 'Remove Green' })).not.toBeInTheDocument();
  expect(onChange).toHaveBeenLastCalledWith(['Blue']);
  fireEvent.paste(input, { clipboardData: { getData: () => 'Red, Yellow\nPurple' } });
  expect(screen.getByRole('button', { name: 'Remove Purple' })).toBeInTheDocument();
  expect(onChange).toHaveBeenLastCalledWith(['Blue', 'Red', 'Yellow', 'Purple']);
});

test('controlled tag input reports changes and respects its limit', () => {
  const onChange = jest.fn();
  const { rerender } = render(<TagInput label="Teams" value={['Support']} maxTags={2} onChange={onChange}/>);
  const input = screen.getByRole('textbox', { name: 'Teams' });
  fireEvent.change(input, { target: { value: 'Engineering' } });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith(['Support', 'Engineering']);
  expect(screen.queryByRole('button', { name: 'Remove Engineering' })).not.toBeInTheDocument();
  rerender(<TagInput label="Teams" value={['Support', 'Engineering']} maxTags={2} onChange={onChange}/>);
  expect(input).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Engineering' }));
  expect(onChange).toHaveBeenLastCalledWith(['Support']);
});

test('tabs support keyboard selection', () => {
  const onChange = jest.fn();
  render(<Tabs tabs={['General', 'Security', 'Advanced']} active="General" onChange={onChange}/>);
  fireEvent.keyDown(screen.getByRole('tab', { name: 'General' }), { key: 'ArrowRight' });
  expect(onChange).toHaveBeenCalledWith('Security', expect.objectContaining({ id: 'Security' }));
  expect(screen.getByRole('tab', { name: 'Security' })).toHaveFocus();
});

test('clickable table rows support Enter', () => {
  const onRowClick = jest.fn();
  render(<DataTable columns={[{ key: 'name', label: 'Policy' }]} rows={[{ id: 'one', name: 'Default policy' }]} onRowClick={onRowClick}/>);
  fireEvent.keyDown(screen.getByText('Default policy').closest('tr'), { key: 'Enter' });
  expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'one' }), 0);
});

test('modal closes on Escape and restores focus', () => {
  function Example() {
    const [open, setOpen] = React.useState(false);
    return <><Button onClick={() => setOpen(true)}>Open settings</Button><Modal title="Settings" open={open} onClose={() => setOpen(false)}>Settings content</Modal></>;
  }
  render(<Example/>);
  const opener = screen.getByRole('button', { name: 'Open settings' });
  opener.focus();
  fireEvent.click(opener);
  expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(opener).toHaveFocus();
});
