import React from 'react';
import { TextField } from './index';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: { helpText: { control: 'text' } },
  parameters: { layout: 'padded', docs: { description: { component: 'Labeled native fields with optional hints, accessible error messages, and click-to-reveal helpText beside the label.' } } },
};
export default meta;

export const TextInput = {
  args: { label: 'Server name', placeholder: 'server.example.com', hint: 'Enter a host name or IP address', helpText: 'Use the DNS name that administrators can reach from their browser.' },
  parameters: { docs: { source: { code: `<TextField label="Server name" placeholder="server.example.com" hint="Enter a host name or IP address" helpText="Use the DNS name that administrators can reach from their browser." />` } } },
};
export const Validation = {
  args: { label: 'Email address', defaultValue: 'invalid', error: 'Enter a valid email address' },
  parameters: { docs: { source: { code: `<TextField label="Email address" defaultValue="invalid" error="Enter a valid email address" />` } } },
};
export const Disabled = {
  render: () => <TextField label="Read only server" value="ad.example.com" readOnly/>,
};
