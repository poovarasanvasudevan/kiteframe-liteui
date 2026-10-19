import React, { useState } from 'react';
import { ReportCategoryBar, ReportFilters, ReportNavigation, ReportResults, ReportPageHeading } from '../widgets/ReportWidgets';
import { ActionStatus, StoryPreview, source, usePreviewValue } from '../widgets/stories/StoryPreview';

const groups = [
  { label: 'Account reports', items: [{ id: 'locked', label: 'Locked out users' }, { id: 'expired', label: 'Expired passwords' }] },
  { label: 'MFA reports', items: [{ id: 'enrolled', label: 'Enrolled users' }, { id: 'failures', label: 'MFA failures' }] },
];
const meta = { title: 'Widgets/Reports', tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Each report widget accepts caller supplied groups, filters, labels, and actions. Edit Args to test different report content.' } } } };
export default meta;

export const Navigation = {
  name: 'ReportNavigation',
  args: { groups, selected: 'locked', searchPlaceholder: 'Search reports', searchLabel: 'Search reports', emptyLabel: 'No reports found', ariaLabel: 'Report navigation' },
  render: NavigationExample,
  parameters: source('<ReportNavigation groups={groups} selected={reportId} onSelect={setReportId} searchPlaceholder="Search reports" />'),
};
function NavigationExample(args) {
  const [selected, setSelected] = usePreviewValue(args.selected);
  const [action, setAction] = useState('');
  return <StoryPreview width={320}><div className="ad-sidebar" style={{ width: 280, minHeight: 320 }}><ReportNavigation {...args} selected={selected} onSelect={(id, item) => { setSelected(id); setAction(`Selected: ${item.label}`); }} onSearchChange={value => setAction(`Search: ${value}`)}/></div><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Categories = {
  name: 'ReportCategoryBar',
  args: { groups, selected: 'locked', ariaLabel: 'Report categories' },
  render: CategoriesExample,
  parameters: source('<ReportCategoryBar groups={groups} selected={reportId} onSelect={setReportId} />'),
};
function CategoriesExample(args) {
  const [selected, setSelected] = usePreviewValue(args.selected);
  const [action, setAction] = useState('');
  return <StoryPreview><ReportCategoryBar {...args} selected={selected} onSelect={(id, item) => { setSelected(id); setAction(`Selected: ${item.label}`); }}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Filters = {
  name: 'ReportFilters',
  args: { domains: ['Production', 'Staging'], domain: 'Production', ouOptions: ['All teams', 'Support', 'Engineering'], ou: 'All teams', generating: false, labels: { domain: 'Directory', selectOu: 'Organizational unit', generate: 'Generate', stop: 'Stop' } },
  render: FiltersExample,
  parameters: source('<ReportFilters domains={["Production", "Staging"]} domain={domain} onDomainChange={setDomain} ouOptions={["All teams", "Support"]} ou={ou} onOuChange={setOu} onGenerate={generate} />'),
};
function FiltersExample(args) {
  const [domain, setDomain] = usePreviewValue(args.domain);
  const [ou, setOu] = usePreviewValue(args.ou);
  const [generating, setGenerating] = usePreviewValue(args.generating);
  const [action, setAction] = useState('');
  return <StoryPreview><ReportFilters {...args} domain={domain} ou={ou} generating={generating} onDomainChange={value => { setDomain(value); setAction(`Directory: ${value}`); }} onOuChange={value => { setOu(value); setAction(`OU: ${value}`); }} onGenerate={() => { setGenerating(true); setAction('Generating report'); }} onStop={() => { setGenerating(false); setAction('Stopped'); }}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const Results = {
  name: 'ReportResults',
  args: { status: 'empty', emptyMessage: 'No data available. Generate the report to view results.', loadingMessage: 'Generating report…' },
  argTypes: { status: { control: 'select', options: ['empty', 'loading'] } },
  render: args => <StoryPreview><ReportResults {...args}/></StoryPreview>,
  parameters: source('<ReportResults status="empty" emptyMessage="No data available" />'),
};

export const Heading = {
  name: 'ReportPageHeading',
  args: { title: 'Locked out users', scheduleLabel: 'Schedule report', scheduleIcon: 'alarmClock', helpText: 'Users currently locked out of their accounts' },
  argTypes: { scheduleIcon: { control: 'select', options: ['alarmClock', 'calendarClock', 'calendarDays'] } },
  render: HeadingExample,
  parameters: source('<ReportPageHeading title="Locked out users" scheduleLabel="Schedule report" scheduleIcon="calendarClock" onSchedule={() => openScheduler()} />'),
};
function HeadingExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview><ReportPageHeading {...args} onSchedule={() => setAction('Schedule clicked')}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}
