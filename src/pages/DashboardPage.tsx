import type * as React from 'react';
import { useState } from 'react';
import {
  DASHBOARD_METRICS, DASHBOARD_SHORTCUTS, DIRECTORY_REPORT_DATA, MFA_REPORT_DATA, SELF_SERVICE_REPORT_DATA,
  MetricWidget, WidgetFrame, ActiveDirectoryChart, MfaChart, SelfServiceChart, ShortcutRail, DashboardToolbar, DashboardLayout, ExpandedWidget,
  type DashboardMetric, type ChartDatum, type ShortcutGroup, type ShortcutItem, type ColumnChartProps, type MfaChartProps,
  type WidgetFrameProps, type DashboardToolbarProps, type DashboardMenuItem,
} from '../widgets';
import type { DirectoryOption } from '../widgets';

type ChartKey = 'directory' | 'mfa' | 'selfService';
export interface DashboardPageProps {
  metrics?: DashboardMetric[];
  directoryData?: ChartDatum[];
  mfaData?: ChartDatum[];
  selfServiceData?: ChartDatum[];
  shortcuts?: ShortcutGroup[];
  domains?: DirectoryOption[];
  domain?: string;
  onDomainChange?: (value: string, item?: DirectoryOption) => void;
  chartTitles?: Partial<Record<ChartKey, string>>;
  chartProps?: { directory?: ColumnChartProps; mfa?: MfaChartProps; selfService?: ColumnChartProps };
  widgetProps?: Partial<Record<ChartKey, Partial<WidgetFrameProps>>>;
  toolbarProps?: DashboardToolbarProps;
  onMetricSelect?: (item: DashboardMetric) => void;
  onReportSelect?: (id: string, item: DashboardMetric | ChartDatum) => void;
  onShortcutSelect?: (id: string, item: ShortcutItem) => void;
  onToolbarAction?: (id: string, item: DashboardMenuItem) => void;
  renderMetric?: (item: DashboardMetric, index: number) => React.ReactNode;
  renderShortcuts?: (groups: ShortcutGroup[]) => React.ReactNode;
}
export function DashboardPage({ metrics = DASHBOARD_METRICS, directoryData = DIRECTORY_REPORT_DATA, mfaData = MFA_REPORT_DATA, selfServiceData = SELF_SERVICE_REPORT_DATA, shortcuts = DASHBOARD_SHORTCUTS, domains, domain, onDomainChange, chartTitles = {}, chartProps = {}, widgetProps = {}, toolbarProps = {}, onMetricSelect, onReportSelect, onShortcutSelect, onToolbarAction, renderMetric, renderShortcuts }: DashboardPageProps) {
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [expanded, setExpanded] = useState<ChartKey | null>(null);
  const titles: Record<ChartKey, string> = { directory: 'Active Directory Reports', mfa: 'MFA Reports', selfService: 'Password Self-Service Reports', ...chartTitles };
  const reportAction = (key: ChartKey, id: string, item: ChartDatum) => {
    chartProps[key]?.onSelect?.(id, item);
    onReportSelect?.(id, item);
  };
  const charts = {
    directory: <ActiveDirectoryChart {...chartProps.directory} data={directoryData} onSelect={(id, item) => reportAction('directory', id, item)}/>,
    mfa: <MfaChart {...chartProps.mfa} data={mfaData} onSelect={(id, item) => reportAction('mfa', id, item)}/>,
    selfService: <SelfServiceChart {...chartProps.selfService} data={selfServiceData} onSelect={(id, item) => reportAction('selfService', id, item)}/>,
  };
  const frame = (key: ChartKey, className = '') => <WidgetFrame {...widgetProps[key]} title={titles[key]} className={className || widgetProps[key]?.className} onExpand={() => { widgetProps[key]?.onExpand?.(); setExpanded(key); }}>{charts[key]}</WidgetFrame>;
  return <div className="dash-page">
    <DashboardToolbar
      {...toolbarProps}
      domains={domains ?? toolbarProps.domains}
      domain={domain ?? toolbarProps.domain}
      onDomainChange={(value, item) => { onDomainChange?.(value, item); toolbarProps.onDomainChange?.(value, item); }}
      showShortcuts={showShortcuts}
      onToggleShortcuts={() => { setShowShortcuts(!showShortcuts); toolbarProps.onToggleShortcuts?.(!showShortcuts); }}
      onExpand={() => { toolbarProps.onExpand?.(); setExpanded('directory'); }}
      onMenuAction={(id, item) => { onToolbarAction?.(id, item); toolbarProps.onMenuAction?.(id, item); }}
    />
    <DashboardLayout
      showShortcuts={showShortcuts}
      metrics={metrics.map((item, index) => renderMetric ? renderMetric(item, index) : <MetricWidget key={item.id ?? item.title ?? index} {...item} onClick={() => { item.onClick?.(item); onMetricSelect?.(item); if (item.report !== undefined) onReportSelect?.(item.report, item); }}/>)}
      charts={<>{frame('directory')}{frame('mfa')}{frame('selfService', 'dash-wide-widget')}</>}
      shortcuts={renderShortcuts ? renderShortcuts(shortcuts) : <ShortcutRail groups={shortcuts} onSelect={onShortcutSelect}/>}
    />
    <ExpandedWidget title={expanded ? titles[expanded] : null} onClose={() => setExpanded(null)}>{expanded ? charts[expanded] : null}</ExpandedWidget>
  </div>;
}
