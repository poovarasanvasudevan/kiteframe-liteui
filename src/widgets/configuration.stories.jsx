import React, { useState } from 'react';
import { ConfigurationHeader, ConfigurationSidebar, PolicyFeatureStrip, PolicyTable, PolicyToolbar } from './ConfigurationWidgets';
import { ActionStatus, StoryPreview, source, usePreviewValue } from './stories/StoryPreview';

const groups = [
  { label: 'Self-service', items: [{ id: 'policy', label: 'Policy configuration' }, { id: 'mfa', label: 'Multi-factor authentication' }] },
  { label: 'Security', items: [{ id: 'hardening', label: 'Security hardening' }] },
];
const policies = [
  { id: 'default', name: 'Default users', domain: 'Production', owner: 'Admin' },
  { id: 'remote', name: 'Remote users', domain: 'Staging', owner: 'Support' },
];
const meta = { title: 'Widgets/Configuration', tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Change sidebar groups, feature definitions, toolbar text, and policy rows in Args. Actions are shown below each preview.' } } } };
export default meta;

export const Sidebar = {
  name: 'ConfigurationSidebar',
  args: { groups, selected: 'policy', initialOpen: 'Self-service' },
  render: SidebarExample,
  parameters: source('<ConfigurationSidebar groups={groups} selected={selected} onSelect={setSelected} />'),
};
function SidebarExample(args) {
  const [selected, setSelected] = usePreviewValue(args.selected);
  const [action, setAction] = useState('');
  return <StoryPreview width={300}><div className="ad-sidebar" style={{ width: 260, minHeight: 320 }}><ConfigurationSidebar {...args} selected={selected} onSelect={(id, item) => { setSelected(id); setAction(`Selected: ${item.label}`); }}/></div><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Header = {
  name: 'ConfigurationHeader',
  args: { title: 'Policy configuration', mode: 'Password self-service modes', helpText: 'Configure administrator policies' },
  render: HeaderExample,
  parameters: source('<ConfigurationHeader title="Policy configuration" mode="Password self-service modes" onModeChange={setMode} />'),
};
function HeaderExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview><ConfigurationHeader {...args} onModeChange={mode => setAction(`Mode: ${mode}`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Features = {
  name: 'PolicyFeatureStrip',
  args: { title: 'Self-service features', instruction: 'Select a feature to configure it.', features: [{ id: 'reset', label: 'Reset password' }, { id: 'unlock', label: 'Unlock account' }, { id: 'profile', label: 'Update profile' }] },
  render: FeaturesExample,
  parameters: source('<PolicyFeatureStrip title="Self-service features" features={[{ id: "reset", label: "Reset password" }]} instruction="Select a feature" onFeatureSelect={handleFeature} />'),
};
function FeaturesExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview><PolicyFeatureStrip {...args} onFeatureSelect={(_, item) => setAction(`Feature: ${item.label}`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Toolbar = {
  name: 'PolicyToolbar',
  args: { title: 'Available policies', addLabel: 'Add policy', searchLabel: 'Search policies', count: 38, page: 1, pageSize: 10, query: '' },
  render: ToolbarExample,
  parameters: source('<PolicyToolbar title="Available policies" count={38} page={page} pageSize={10} onPageChange={setPage} query={query} onQueryChange={setQuery} onAdd={addPolicy} />'),
};
function ToolbarExample(args) {
  const [page, setPage] = usePreviewValue(args.page);
  const [query, setQuery] = usePreviewValue(args.query);
  const [action, setAction] = useState('');
  return <StoryPreview><PolicyToolbar {...args} page={page} query={query} onPageChange={next => { setPage(next); setAction(`Page: ${next}`); }} onQueryChange={next => { setQuery(next); setPage(1); setAction(`Search: ${next}`); }} onAdd={() => setAction('Add policy clicked')}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Table = {
  name: 'PolicyTable',
  args: { policies, columns: [{ key: 'actions', label: 'Actions' }, { key: 'name', label: 'Policy' }, { key: 'domain', label: 'Directory' }, { key: 'owner', label: 'Owner' }], defaultDomain: 'Production', emptyMessage: 'No policies found', actionLabels: { edit: 'Edit', delete: 'Delete', copy: 'Copy' } },
  render: TableExample,
  parameters: source('<PolicyTable policies={policies} columns={[{ key: "name", label: "Policy" }, { key: "domain", label: "Directory" }]} onEdit={editPolicy} />'),
};
function TableExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview><PolicyTable {...args} onEdit={item => setAction(`Edit: ${item.name}`)} onDelete={item => setAction(`Delete: ${item.name}`)} onCopy={item => setAction(`Copy: ${item.name}`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const EmptyTable = {
  name: 'PolicyTable / empty',
  args: { policies: [], columns: [{ key: 'name', label: 'Policy' }, { key: 'domain', label: 'Directory' }], emptyMessage: 'No policies match your search' },
  render: args => <StoryPreview><PolicyTable {...args}/></StoryPreview>,
  parameters: source('<PolicyTable policies={[]} columns={[{ key: "name", label: "Policy" }]} emptyMessage="No policies match your search" />'),
};
