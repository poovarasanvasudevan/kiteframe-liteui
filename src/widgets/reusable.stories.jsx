import React, { useState } from 'react';
import { Button, DataTable, PageHeader } from './Primitives';
import { DashboardToolbar, WidgetFrame, ActiveDirectoryChart } from './DashboardWidgets';
import { ReportNavigation, ReportCategoryBar, ReportFilters, ReportPageHeading } from './ReportWidgets';
import { AppShell, CollapsibleSidebar, ShellFooter, ShellHeader, TopNavigation } from './Shell';
import { ConfigurationSidebar, PolicyFeatureStrip, PolicyTable, PolicyToolbar } from './ConfigurationWidgets';
import { Frame, InlineSelect } from './SettingsWidgets';

const groups = [
  { label: 'Sales Reports', items: [{ id: 'daily', label: 'Daily Sales' }, { id: 'monthly', label: 'Monthly Sales' }] },
  { label: 'People Reports', items: [{ id: 'team', label: 'Team Activity' }] },
];
const sections = [{ id: 'dashboard', label: 'Dashboard' }, { id: 'reports', label: 'Reports' }, { id: 'settings', label: 'Settings' }];
const sidebarGroups = [
  { label: 'Manage', items: [{ id: 'users', label: 'Users' }, { id: 'roles', label: 'Roles' }] },
  { label: 'Billing', items: [{ id: 'plans', label: 'Plans' }] },
];
const policies = [
  { id: 'starter', name: 'Starter', domain: 'North', owner: 'Alice', seats: 12 },
  { id: 'business', name: 'Business', domain: 'South', owner: 'Bob', seats: 38 },
];

const meta = {
  title: 'Widgets',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Edit the Args controls to change content. Use the controls in each preview to see callbacks and state changes. Import these components from kiteapps-float.' } },
  },
};
export default meta;

function Surface({ children, width, background = '#f7f8f8' }) {
  return <div style={{ minHeight: 180, padding: 24, background }}><div style={{ maxWidth: width }}>{children}</div></div>;
}
function Feedback({ value }) {
  return <div role="status" style={{ marginTop: 16, padding: '9px 12px', maxWidth: 520, border: '1px solid #dfe6e7', background: '#fff', color: '#3d5057', fontSize: 12 }}>
    Last action: {value || 'Try the widget controls'}
  </div>;
}

export const PageHeaderWidget = {
  name: 'PageHeader',
  args: { title: 'Team Settings', help: 'Manage access for your workspace', actionLabel: 'Add team member' },
  render: args => <PageHeaderDemo {...args}/>,
};
function PageHeaderDemo({ title, help, actionLabel }) {
  const [event, setEvent] = useState('');
  return <Surface><PageHeader title={title} help={help} action={<Button onClick={() => setEvent('Add team member clicked')}>{actionLabel}</Button>}/><Feedback value={event}/></Surface>;
}

export const DashboardToolbarWidget = {
  name: 'DashboardToolbar',
  args: {
    domains: ['Production', 'Staging'],
    domainLabel: 'Workspace:',
    settingsLabel: 'Dashboard options',
    expandLabel: 'Expand dashboard',
    menuItems: [{ id: 'refresh', label: 'Refresh data' }, { id: 'shortcuts', label: 'Toggle shortcuts' }],
  },
  render: args => <DashboardToolbarDemo {...args}/>,
};
function DashboardToolbarDemo(args) {
  const [event, setEvent] = useState('');
  const [shortcuts, setShortcuts] = useState(true);
  return <Surface><DashboardToolbar {...args} showShortcuts={shortcuts} onDomainChange={value => setEvent(`Workspace: ${value}`)} onMenuAction={id => setEvent(`Menu: ${id}`)} onToggleShortcuts={() => { setShortcuts(!shortcuts); setEvent(`Shortcuts ${shortcuts ? 'hidden' : 'shown'}`); }} onExpand={() => setEvent('Expand clicked')}/><Feedback value={event}/></Surface>;
}

export const ReportNavigationWidget = {
  name: 'ReportNavigation',
  args: { groups, searchPlaceholder: 'Find a report', searchLabel: 'Find a report' },
  render: args => <ReportNavigationDemo {...args}/>,
};
function ReportNavigationDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface width={244}><div className="ad-sidebar" style={{ minHeight: 350, width: 244, position: 'relative' }}><ReportNavigation {...args} onSelect={(id, item) => setEvent(`Selected: ${item.label} (${id})`)} onSearchChange={value => setEvent(`Search: ${value}`)}/></div><Feedback value={event}/></Surface>;
}

export const ReportCategoryBarWidget = {
  name: 'ReportCategoryBar',
  args: { groups },
  render: args => <ReportCategoryBarDemo {...args}/>,
};
function ReportCategoryBarDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><ReportCategoryBar {...args} onSelect={(id, item) => setEvent(`Selected: ${item.label} (${id})`)}/><Feedback value={event}/></Surface>;
}

export const ReportFiltersWidget = {
  name: 'ReportFilters',
  args: { domains: ['North', 'South'], ouOptions: ['All Teams', 'Retail'], labels: { domain: 'Region', selectOu: 'Choose team', generate: 'Run report', stop: 'Stop report' } },
  render: args => <ReportFiltersDemo {...args}/>,
};
function ReportFiltersDemo(args) {
  const [event, setEvent] = useState('');
  const [generating, setGenerating] = useState(false);
  return <Surface><ReportFilters {...args} generating={generating} onDomainChange={value => setEvent(`Region: ${value}`)} onOuChange={value => setEvent(`Team: ${value}`)} onGenerate={() => { setGenerating(true); setEvent('Generate clicked'); }} onStop={() => { setGenerating(false); setEvent('Stop clicked'); }}/><Feedback value={event}/></Surface>;
}

export const ReportPageHeadingWidget = {
  name: 'ReportPageHeading',
  args: { title: 'Daily Sales', scheduleLabel: 'Schedule report', helpText: 'About this report' },
  render: args => <ReportPageHeadingDemo {...args}/>,
};
function ReportPageHeadingDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><ReportPageHeading {...args} onSchedule={() => setEvent('Schedule clicked')}/><Feedback value={event}/></Surface>;
}

export const ShellHeaderWidget = {
  name: 'ShellHeader',
  args: { brand: 'Acme Console', sections, directories: ['Production', 'Staging'], searchPlaceholder: 'Search customers', settingsLabel: 'Preferences', utilityItems: [], showBrandOrbit: false, showDownload: false, showNotifications: false, showUserMenu: false },
  render: args => <ShellHeaderDemo {...args}/>,
};
function ShellHeaderDemo(args) {
  const [event, setEvent] = useState('');
  const [active, setActive] = useState(args.sections?.[0]?.id);
  return <><ShellHeader {...args} activeSection={active} onSectionChange={(id, item) => { setActive(id); setEvent(`Section: ${item.label}`); }} onDirectoryChange={value => setEvent(`Directory: ${value}`)} onSearchChange={value => setEvent(`Search: ${value}`)} onSettingsClick={() => setEvent('Preferences clicked')}/><Surface><Feedback value={event}/></Surface></>;
}

export const TopNavigationWidget = {
  name: 'TopNavigation',
  args: { sections, ariaLabel: 'Product sections' },
  render: args => <TopNavigationDemo {...args}/>,
};
function TopNavigationDemo(args) {
  const [active, setActive] = useState(args.sections?.[0]?.id);
  const [event, setEvent] = useState('');
  return <Surface><div style={{ background: '#3e4d56', height: 32 }}><TopNavigation {...args} active={active} onChange={(id, item) => { setActive(id); setEvent(`Section: ${item.label}`); }}/></div><Feedback value={event}/></Surface>;
}

export const ShellFooterWidget = {
  name: 'ShellFooter',
  args: { items: [{ id: 'help', label: 'Help Center' }, { id: 'feedback', label: 'Send Feedback' }] },
  render: args => <ShellFooterDemo {...args}/>,
};
function ShellFooterDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><ShellFooter {...args} onItemSelect={(id, item) => setEvent(`Clicked: ${item.label} (${id})`)}/><Feedback value={event}/></Surface>;
}

export const AppShellWidget = {
  name: 'AppShell',
  args: { brand: 'Acme Console', pageTitle: 'Workspace overview' },
  render: args => <AppShellDemo {...args}/>,
};
function AppShellDemo({ brand, pageTitle }) {
  const [event, setEvent] = useState('');
  return <AppShell activeSection="dashboard" onSectionChange={id => setEvent(`Section: ${id}`)} sidebar={<CollapsibleSidebar groups={sidebarGroups} onSelect={id => setEvent(`Sidebar: ${id}`)}/>} headerProps={{ brand, sections, utilityItems: [], showDownload: false, showNotifications: false, showUserMenu: false, showBrandOrbit: false }} footerProps={{ items: [{ id: 'help', label: 'Help Center' }], onItemSelect: id => setEvent(`Footer: ${id}`) }}><div style={{ padding: 24 }}><h1>{pageTitle}</h1><p>Your page content goes here.</p><Feedback value={event}/></div></AppShell>;
}

export const CollapsibleSidebarWidget = {
  name: 'CollapsibleSidebar',
  args: { groups: sidebarGroups, ariaLabel: 'Workspace pages' },
  render: args => <SidebarDemo component={CollapsibleSidebar} {...args}/>,
};
export const ConfigurationSidebarWidget = {
  name: 'ConfigurationSidebar',
  args: { groups: sidebarGroups },
  render: args => <SidebarDemo component={ConfigurationSidebar} {...args}/>,
};
function SidebarDemo({ component: Component, ...args }) {
  const [event, setEvent] = useState('');
  return <Surface width={244}><div className="ad-sidebar" style={{ width: 244, minHeight: 330, position: 'relative' }}><Component {...args} onSelect={(id, item) => setEvent(`Selected: ${item.label} (${id})`)}/></div><Feedback value={event}/></Surface>;
}

export const PolicyFeatureStripWidget = {
  name: 'PolicyFeatureStrip',
  args: { title: 'Account features', instruction: 'Select a feature to configure it.', features: [{ id: 'reset', label: 'Reset Password' }, { id: 'unlock', label: 'Unlock Account' }, { id: 'profile', label: 'Update Profile' }] },
  render: args => <PolicyFeatureStripDemo {...args}/>,
};
function PolicyFeatureStripDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><PolicyFeatureStrip {...args} onFeatureSelect={(id, item) => setEvent(`Feature: ${item.label} (${id})`)}/><Feedback value={event}/></Surface>;
}

export const PolicyToolbarWidget = {
  name: 'PolicyToolbar',
  args: { title: 'Available plans', addLabel: 'Add plan', count: 38, pageSize: 10, searchLabel: 'Search plans' },
  render: args => <PolicyToolbarDemo {...args}/>,
};
function PolicyToolbarDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><PolicyToolbar {...args} onAdd={() => setEvent('Add clicked')} onPageChange={page => setEvent(`Page: ${page}`)} onQueryChange={query => setEvent(`Search: ${query}`)}/><Feedback value={event}/></Surface>;
}

export const PolicyTableWidget = {
  name: 'PolicyTable',
  args: { policies, columns: [{ key: 'actions', label: 'Actions' }, { key: 'name', label: 'Plan' }, { key: 'domain', label: 'Region' }, { key: 'owner', label: 'Owner' }] },
  render: args => <PolicyTableDemo {...args}/>,
};
export const PolicyTableCustomColumns = {
  name: 'PolicyTable / custom columns',
  args: { policies, columns: [{ key: 'name', label: 'Plan' }, { key: 'seats', label: 'Seats' }, { key: 'owner', label: 'Account owner' }] },
  render: args => <PolicyTableDemo {...args}/>,
};
export const PolicyTableEmpty = {
  name: 'PolicyTable / empty state',
  args: { policies: [], columns: [{ key: 'name', label: 'Plan' }, { key: 'domain', label: 'Region' }], emptyMessage: 'No plans match your search' },
  render: args => <PolicyTableDemo {...args}/>,
};
function PolicyTableDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><PolicyTable {...args} onEdit={row => setEvent(`Edit: ${row.name}`)} onDelete={row => setEvent(`Delete: ${row.name}`)} onCopy={row => setEvent(`Copy: ${row.name}`)}/><Feedback value={event}/></Surface>;
}

export const DataTableWidget = {
  name: 'DataTable / object rows',
  args: { columns: [{ key: 'name', label: 'Plan' }, { key: 'domain', label: 'Region' }, { key: 'owner', label: 'Owner' }], rows: policies, empty: 'No plans found' },
  render: args => <DataTableDemo {...args}/>,
};
function DataTableDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><DataTable {...args} onRowClick={row => setEvent(`Row: ${row.name}`)}/><Feedback value={event}/></Surface>;
}

export const SettingsFrameWidget = {
  name: 'Settings Frame / tabs',
  args: { title: 'Workspace Settings', tabs: [{ id: 'general', label: 'General' }, { id: 'notifications', label: 'Notifications' }], help: 'Configure this workspace' },
  render: args => <SettingsFrameDemo {...args}/>,
};
function SettingsFrameDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><Frame {...args} onTabChange={id => setEvent(`Tab: ${id}`)}>{active => <div style={{ padding: 16 }}>{active} settings content</div>}</Frame><Feedback value={event}/></Surface>;
}

export const InlineSelectWidget = {
  name: 'InlineSelect',
  args: { options: [{ value: 'north', label: 'North region' }, { value: 'south', label: 'South region' }], width: 220, 'aria-label': 'Region' },
  render: args => <InlineSelectDemo {...args}/>,
};
function InlineSelectDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface><InlineSelect {...args} onChange={value => setEvent(`Selected: ${value}`)}/><Feedback value={event}/></Surface>;
}

export const WidgetFrameWidget = {
  name: 'WidgetFrame / chart container',
  args: { title: 'Order status' },
  render: args => <WidgetFrameDemo {...args}/>,
};
function WidgetFrameDemo(args) {
  const [event, setEvent] = useState('');
  return <Surface width={500}><WidgetFrame {...args} onExpand={() => setEvent('Expand clicked')} onRefresh={() => setEvent('Refresh clicked')} onMore={() => setEvent('More clicked')}><ActiveDirectoryChart axisLabel="Orders" max={100} unit="orders" data={[{ id: 'open', label: 'Open', value: 64 }, { id: 'closed', label: 'Closed', value: 28 }]} onSelect={id => setEvent(`Chart: ${id}`)}/></WidgetFrame><Feedback value={event}/></Surface>;
}
