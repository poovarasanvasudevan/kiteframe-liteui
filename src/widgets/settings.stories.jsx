import React, { useState } from 'react';
import { Button } from './Primitives';
import { Frame, InlineSelect, SaveBar } from './SettingsWidgets';
import { ActionStatus, StoryPreview, source, usePreviewValue } from './stories/StoryPreview';

const meta = { title: 'Widgets/Settings', tags: ['autodocs'], parameters: { layout: 'padded', docs: { description: { component: 'Settings widgets can be used independently. Args let you edit tabs, save labels, confirmation text, and select options.' } } } };
export default meta;

export const SettingsFrame = {
  name: 'Frame',
  args: { title: 'Login settings', tabs: [{ id: 'general', label: 'General' }, { id: 'sso', label: 'Single sign-on' }, { id: 'smart-card', label: 'Smart card' }], activeTab: 'general', help: 'Configure administrator sign-in', actionLabel: 'Manage attributes' },
  render: FrameExample,
  parameters: source('<Frame title="Login settings" tabs={[{ id: "general", label: "General" }, { id: "sso", label: "Single sign-on" }]} activeTab={activeTab} onTabChange={setActiveTab}>{active => <p>{active} settings</p>}</Frame>'),
};
function FrameExample({ actionLabel, ...args }) {
  const [activeTab, setActiveTab] = usePreviewValue(args.activeTab);
  const [action, setAction] = useState('');
  return <StoryPreview><Frame {...args} activeTab={activeTab} action={<Button onClick={() => setAction(`${actionLabel} clicked`)}>{actionLabel}</Button>} onTabChange={next => { setActiveTab(next); setAction(`Tab: ${next}`); }}>{active => <div style={{ padding: 16 }}>{active} settings content</div>}</Frame><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const SaveActions = {
  name: 'SaveBar',
  args: { saveLabel: 'Save changes', cancelLabel: 'Cancel', cancel: true, successMessage: 'Settings saved', status: '' },
  render: SaveBarExample,
  parameters: source('<SaveBar saveLabel="Save changes" cancelLabel="Cancel" onSave={saveSettings} onCancel={discardChanges} />'),
};
function SaveBarExample(args) {
  const [status, setStatus] = usePreviewValue(args.status);
  return <StoryPreview><SaveBar {...args} status={status} onSave={() => setStatus(args.successMessage)} onCancel={() => setStatus('Changes discarded')}/></StoryPreview>;
}

export const InlineDropdown = {
  name: 'InlineSelect',
  args: { options: [{ value: 'ad', label: 'Active Directory' }, { value: 'entra', label: 'Microsoft Entra ID' }], value: 'ad', width: 240, 'aria-label': 'Directory' },
  render: InlineSelectExample,
  parameters: source('<InlineSelect options={[{ value: "ad", label: "Active Directory" }, { value: "entra", label: "Microsoft Entra ID" }]} value={directory} onChange={setDirectory} aria-label="Directory" />'),
};
function InlineSelectExample(args) {
  const [value, setValue] = usePreviewValue(args.value);
  return <StoryPreview><InlineSelect {...args} value={value} onChange={setValue}/><ActionStatus>Selected: {value}</ActionStatus></StoryPreview>;
}
