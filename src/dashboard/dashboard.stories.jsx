import React, { useState } from 'react';
import { ActiveDirectoryChart, DashboardLayout, DashboardToolbar, ExpandedWidget, MetricWidget, MfaChart, SelfServiceChart, ShortcutRail, WidgetFrame } from '../widgets/DashboardWidgets';
import { ActionStatus, StoryPreview, source, usePreviewValue } from '../widgets/stories/StoryPreview';

const meta = {
  title: 'Widgets/Dashboard',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Edit Args to change the data and labels of each dashboard component. Interactions update the preview or the action readout.' } } },
};
export default meta;

const barData = [
  { id: 'locked', label: 'Locked out', value: 5 },
  { id: 'expiring', label: 'Expiring', value: 26 },
  { id: 'expired', label: 'Expired', value: 62 },
];

export const Metric = {
  name: 'MetricWidget',
  args: { title: 'Password expiration', value: '26 / 62', caption: 'Expiring / expired passwords', tone: 'rose', iconSize: 43 },
  argTypes: { tone: { control: 'select', options: ['rose', 'blue', 'orange', 'green'] }, icon: { control: false } },
  render: MetricExample,
  parameters: source('<MetricWidget title="Password expiration" value="26 / 62" caption="Expiring / expired passwords" tone="rose" onClick={() => console.log("Metric selected")} />'),
};
function MetricExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={250}><MetricWidget {...args} onClick={() => setAction(`${args.title} selected`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const ChartFrame = {
  name: 'WidgetFrame',
  args: { title: 'User reports', showTools: true, labels: { maximize: 'Expand', refresh: 'Refresh', more: 'More options for' }, children: 'Place a chart or custom content here.' },
  render: ChartFrameExample,
  parameters: source('<WidgetFrame title="User reports" showTools onRefresh={refreshData}>Place a chart here</WidgetFrame>'),
};
function ChartFrameExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={500}><WidgetFrame {...args} onExpand={() => setAction('Expand clicked')} onRefresh={() => setAction('Refresh clicked')} onMore={() => setAction('More clicked')}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const ColumnChart = {
  name: 'ActiveDirectoryChart',
  args: { data: barData, max: 80, axisLabel: 'Number of users', unit: 'users', color: '#46c0f2' },
  render: ColumnChartExample,
  parameters: source('<ActiveDirectoryChart data={[{ id: "locked", label: "Locked out", value: 5 }]} max={80} axisLabel="Number of users" onSelect={handleSelect} />'),
};
function ColumnChartExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={500}><WidgetFrame title="User reports" showTools={false}><ActiveDirectoryChart {...args} onSelect={(_, item) => setAction(`${item.label}: ${item.value}`)}/></WidgetFrame><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const PieChart = {
  name: 'MfaChart',
  args: { data: [{ id: 'enrolled', label: 'Enrolled', value: 37, color: '#8864b4' }, { id: 'pending', label: 'Not enrolled', value: 38, color: '#397dd5' }], ariaLabel: 'Enrollment split' },
  render: PieChartExample,
  parameters: source('<MfaChart data={[{ id: "enrolled", label: "Enrolled", value: 37 }, { id: "pending", label: "Not enrolled", value: 38 }]} onSelect={handleSelect} />'),
};
function PieChartExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={500}><WidgetFrame title="Enrollment reports" showTools={false}><MfaChart {...args} onSelect={(_, item) => setAction(`${item.label}: ${item.value}`)}/></WidgetFrame><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const HorizontalChart = {
  name: 'SelfServiceChart',
  args: { data: [{ id: 'reset', label: 'Password reset', value: 35 }, { id: 'unlock', label: 'Unlock account', value: 12 }], max: 40, axisLabel: 'Number of users', unit: 'users', color: '#226958' },
  render: HorizontalChartExample,
  parameters: source('<SelfServiceChart data={[{ id: "reset", label: "Password reset", value: 35 }]} max={40} onSelect={handleSelect} />'),
};
function HorizontalChartExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={800}><WidgetFrame title="Audit reports" showTools={false}><SelfServiceChart {...args} onSelect={(_, item) => setAction(`${item.label}: ${item.value}`)}/></WidgetFrame><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Shortcuts = {
  name: 'ShortcutRail',
  args: { groups: [{ title: 'Account tools', links: [{ id: 'reset', label: 'Reset password' }, { id: 'unlock', label: 'Unlock account' }] }, { title: 'Security', links: [{ id: 'mfa', label: 'Multi-factor authentication' }] }], ariaLabel: 'Administrator shortcuts' },
  render: ShortcutsExample,
  parameters: source('<ShortcutRail groups={[{ title: "Account tools", links: [{ id: "reset", label: "Reset password" }] }]} onSelect={handleSelect} />'),
};
function ShortcutsExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview width={300}><ShortcutRail {...args} onSelect={(_, item) => setAction(`${item.label} selected`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Toolbar = {
  name: 'DashboardToolbar',
  args: { domains: ['Production', 'Staging'], domain: 'Production', domainLabel: 'Directory:', showShortcuts: true, settingsLabel: 'Dashboard settings', expandLabel: 'Expand dashboard', menuItems: [{ id: 'refresh', label: 'Refresh data' }, { id: 'shortcuts', label: 'Toggle shortcuts' }] },
  render: ToolbarExample,
  parameters: source('<DashboardToolbar domains={["Production", "Staging"]} domain={domain} onDomainChange={setDomain} showShortcuts={showShortcuts} onToggleShortcuts={() => setShowShortcuts(!showShortcuts)} />'),
};
function ToolbarExample(args) {
  const [domain, setDomain] = usePreviewValue(args.domain);
  const [showShortcuts, setShowShortcuts] = usePreviewValue(args.showShortcuts);
  const [action, setAction] = useState('');
  return <StoryPreview><DashboardToolbar {...args} domain={domain} showShortcuts={showShortcuts} onDomainChange={value => { setDomain(value); setAction(`Directory: ${value}`); }} onToggleShortcuts={() => setShowShortcuts(!showShortcuts)} onMenuAction={id => setAction(`Menu: ${id}`)} onExpand={() => setAction('Expand clicked')}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Layout = {
  name: 'DashboardLayout',
  args: { showShortcuts: true, metricTitle: 'Password expiration', chartTitle: 'User reports', shortcutTitle: 'Quick links' },
  render: args => <StoryPreview><DashboardLayout showShortcuts={args.showShortcuts} metrics={<MetricWidget title={args.metricTitle} value="26 / 62" caption="Expiring / expired"/>} charts={<WidgetFrame title={args.chartTitle} showTools={false}><ActiveDirectoryChart data={barData}/></WidgetFrame>} shortcuts={<ShortcutRail groups={[{ title: args.shortcutTitle, links: ['Reset password', 'Unlock account'] }]}/>} /></StoryPreview>,
  parameters: source('<DashboardLayout metrics={<MetricWidget title="Password expiration" value="26 / 62" />} charts={<WidgetFrame title="User reports"><ActiveDirectoryChart data={data} /></WidgetFrame>} shortcuts={<ShortcutRail groups={groups} />} />'),
};

export const Expanded = {
  name: 'ExpandedWidget',
  args: { title: 'User reports', closeLabel: 'Close expanded chart', children: 'Expanded chart content' },
  render: ExpandedExample,
  parameters: source('<ExpandedWidget title={title} onClose={() => setTitle(null)}>Expanded chart content</ExpandedWidget>'),
};
function ExpandedExample(args) {
  const [title, setTitle] = usePreviewValue(args.title);
  return <ExpandedWidget {...args} title={title} onClose={() => setTitle(null)}/>;
}
