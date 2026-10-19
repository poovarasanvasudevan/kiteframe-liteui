import React, { useState } from 'react';
import { ActionBar, Button, FormRow, Notice, PageHeader, Panel, SectionTitle, TextField } from './index';

const meta = {
  title: 'Components/Content',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Composable layout pieces for administrator settings pages. Content and actions are supplied by the caller.' } } },
};
export default meta;

export const SettingsPanel = {
  render: () => <Panel><PageHeader title="Connection settings" action={<Button variant="outline">Help</Button>}/><SectionTitle>Server</SectionTitle><FormRow label="Server name" required><TextField placeholder="server.example.com"/></FormRow><Notice>Changes take effect after a restart.</Notice><SaveDemo/></Panel>,
  parameters: { docs: { source: { code: `<Panel>\n  <PageHeader title="Connection settings" />\n  <SectionTitle>Server</SectionTitle>\n  <FormRow label="Server name" required><TextField placeholder="server.example.com" /></FormRow>\n  <ActionBar onSave={() => console.log('Saved')} onCancel={() => console.log('Cancelled')} />\n</Panel>` } } },
};
function SaveDemo() {
  const [status, setStatus] = useState('');
  return <ActionBar onSave={() => setStatus('Settings saved')} onCancel={() => setStatus('Changes discarded')} status={status}/>;
}
export const Notices = { render: () => <div className="story-column"><Notice>Information message</Notice><Notice tone="success">Settings saved</Notice><Notice tone="warning">Restart required</Notice><Notice tone="error">Connection failed. Check the server address.</Notice></div> };
