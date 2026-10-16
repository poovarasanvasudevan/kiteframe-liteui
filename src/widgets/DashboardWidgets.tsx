import type * as React from 'react';
import { useState } from 'react';
import { Clock3, UserRoundPlus, Files, AppWindow, Maximize2, MoreHorizontal, RefreshCw, Settings, X, type LucideIcon } from 'lucide-react';
import type { DirectoryOption } from './Shell';
import '../dashboard/dashboard.css';

export interface MetricWidgetProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'title'> {
  title: string;
  value: React.ReactNode;
  caption?: string;
  icon?: LucideIcon | null;
  tone?: string;
  iconSize?: number;
}
export interface DashboardMetric extends Omit<MetricWidgetProps, 'onClick'> {
  id?: string;
  report?: string;
  onClick?: (item: DashboardMetric) => void;
}
export interface ChartDatum { id: string; label: string; value: number; color?: string }
export interface ShortcutItem { id: string; label: string; href?: string }
export type ShortcutLink = string | ShortcutItem;
export interface ShortcutGroup { id?: string; title: string; links: ShortcutLink[] }
export interface DashboardMenuItem { id: string; label: string; onClick?: (item: DashboardMenuItem) => void }

export const DASHBOARD_METRICS: DashboardMetric[] = [
  { title: 'Password Expiration', value: '0 / 62', caption: 'Soon-to-expire / Expired Passwords', icon: Clock3, tone: 'rose', report: '4' },
  { title: 'Enrollment Status', value: '37 / 38', caption: 'Enrolled / Non Enrolled Users', icon: UserRoundPlus, tone: 'blue', report: '15' },
  { title: 'License Usage', value: '59 / 4941', caption: 'Used / Remaining Licenses', icon: Files, tone: 'orange', report: '17' },
  { title: 'Endpoint MFA', value: '1 / 4999', caption: 'Used / Remaining Licenses', icon: AppWindow, tone: 'green', report: '301' },
];
export const DASHBOARD_SHORTCUTS: ShortcutGroup[] = [
  { title: 'Highlights', links: ['Password Reset / Unlock Account', 'Self Update/Change Password', 'Password Expiry Notification', 'Password Sync/Single Sign On', 'Conditional Access'] },
  { title: 'Multi-factor Authentication', links: ['Security Question & Answer', 'Email Verification', 'SMS Verification', 'Google Authenticator', 'Microsoft Authenticator', 'Microsoft Entra ID MFA', 'Duo Security', 'RSA SecurID', 'RADIUS Authentication', 'Push Notification Authentication', 'Biometric Authentication', 'QR Code Based Authentication', 'TOTP Authentication', 'SAML Authentication', 'AD Security Questions', 'Yubikey Authenticator', 'Zoho OneAuth TOTP', 'Smart Card Authentication', 'Custom TOTP Authenticator', 'FIDO2 Passkeys'] },
  { title: 'Other Features', links: ['Mobile App Deployment', 'Employee Search/Org Chart', 'Mail Group Subscription', 'Self-Service Approval Workflow', 'Update Cached Credential'] },
  { title: 'Password Self-Service Modes', links: ['Via Web Portal', 'Mobile Access', 'GINA/Mac/Linux (Ctrl+Alt+Del)', 'Automatic Reset & Unlock'] },
];
export const DIRECTORY_REPORT_DATA: ChartDatum[] = [
  { id:'2', label:'Locked Out Users', value:0 }, { id:'3', label:'Soon-To-Expire Users', value:0 }, { id:'4', label:'Password Expired Users', value:62 },
];
export const MFA_REPORT_DATA: ChartDatum[] = [
  { id:'15', label:'Enrolled Users', value:37, color:'#8864b4' }, { id:'16', label:'Non-Enrolled Users', value:38, color:'#397dd5' },
];
export const SELF_SERVICE_REPORT_DATA: ChartDatum[] = [
  { id:'6', label:'Reset Password', value:35 }, { id:'7', label:'Unlock Account', value:0 }, { id:'8', label:'Self Update', value:0 }, { id:'9', label:'Change Password', value:0 }, { id:'1210', label:'MFA Failures', value:0 },
];

export function MetricWidget({ title, value, caption, icon: Icon = Clock3, tone = 'blue', iconSize = 43, onClick, className = '', ...props }: MetricWidgetProps) {
  return <button type="button" className={`dash-metric ${className}`} onClick={onClick} {...props}><span className="dash-metric-title">{title}</span><strong>{value}</strong><small>{caption}</small>{Icon && <Icon className={`dash-metric-icon is-${tone}`} size={iconSize} strokeWidth={1.05}/>}</button>;
}

export interface WidgetFrameProps {
  title: string;
  children?: React.ReactNode;
  onExpand?: () => void;
  onRefresh?: () => void;
  onMore?: () => void;
  tools?: React.ReactNode;
  showTools?: boolean;
  labels?: { maximize?: string; refresh?: string; more?: string };
  className?: string;
}
export function WidgetFrame({ title, children, onExpand, onRefresh, onMore, tools, showTools = true, labels = {}, className = '' }: WidgetFrameProps) {
  const [refreshing, setRefreshing] = useState(false);
  return <section className={`dash-widget ${className}`} aria-label={title}><div className="dash-widget-heading"><strong>{title}</strong>{showTools && <div className="dash-widget-tools">{tools || <><button type="button" aria-label={`${labels.maximize || 'Maximize'} ${title}`} onClick={onExpand}><Maximize2 size={14}/></button><button type="button" aria-label={`${labels.refresh || 'Refresh'} ${title}`} onClick={() => { onRefresh?.(); setRefreshing(true); window.setTimeout(() => setRefreshing(false), 500); }}><RefreshCw size={14} className={refreshing ? 'is-spinning' : ''}/></button><button type="button" aria-label={`${labels.more || 'More options for'} ${title}`} onClick={onMore}><MoreHorizontal size={16}/></button></>}</div>}</div>{children}</section>;
}

export interface ColumnChartProps {
  data?: ChartDatum[];
  max?: number;
  ticks?: number[];
  axisLabel?: string;
  unit?: string;
  color?: string;
  onSelect?: (id: string, item: ChartDatum) => void;
}
export function ActiveDirectoryChart({ data = DIRECTORY_REPORT_DATA, max = 80, ticks, axisLabel = 'No. Of Users', unit = 'users', color = '#46c0f2', onSelect }: ColumnChartProps) {
  const ceiling = Math.max(1,Number(max));
  const marks = ticks || [ceiling,ceiling*.75,ceiling*.5,ceiling*.25,0];
  return <div className="dash-column-chart"><span className="dash-axis-title">{axisLabel}</span><div className="dash-y-labels">{marks.map((n,i) => <span key={i}>{n}</span>)}</div><div className="dash-plot">{marks.map((_,i) => <div key={i} className="dash-gridline"/>)}<div className="dash-columns" style={{gridTemplateColumns:`repeat(${Math.max(data.length,1)},1fr)`}}>{data.map((item,i) => <button type="button" key={item.id ?? i} aria-label={`${item.label}: ${item.value} ${unit}`} onClick={() => onSelect?.(item.id,item)}><span className="dash-column" style={{height:`${Math.min(100,Math.max(0,Number(item.value)/ceiling*100))}%`,background:item.color || color}}/><span className="dash-column-label" title={item.label}>{item.label}</span></button>)}</div></div></div>;
}

export interface MfaChartProps { data?: ChartDatum[]; onSelect?: (id: string, item: ChartDatum) => void; ariaLabel?: string }
export function MfaChart({ data = MFA_REPORT_DATA, onSelect, ariaLabel }: MfaChartProps) {
  const total = data.reduce((sum,item) => sum + Number(item.value || 0),0);
  let current = 0;
  const palette = ['#8864b4','#397dd5','#46c0f2','#226958'];
  const gradient = data.map((item,i) => { const start = current; current += total ? Number(item.value || 0)/total*100 : 0; return `${item.color || palette[i%palette.length]} ${start}% ${current}%`; }).join(',');
  return <div className="dash-mfa-chart"><button type="button" className="dash-pie" style={{background:total ? `conic-gradient(${gradient})` : '#e9edef'}} aria-label={ariaLabel || data.map(item => `${item.value} ${item.label}`).join(', ')} onClick={() => data[0] && onSelect?.(data[0].id,data[0])}/><div className="dash-legend">{data.map((item,i) => <button type="button" key={item.id ?? i} onClick={() => onSelect?.(item.id,item)}><i style={{background:item.color || palette[i%palette.length]}}/>{item.label}</button>)}</div></div>;
}

export function SelfServiceChart({ data = SELF_SERVICE_REPORT_DATA, max = 35, ticks, axisLabel = 'No. Of Users', unit = 'users', color = '#226958', onSelect }: ColumnChartProps) {
  const ceiling = Math.max(1,Number(max));
  const marks = ticks || Array.from({length:8},(_,i) => ceiling*i/7);
  const gridStep = 100/Math.max(1,marks.length-1);
  return <div className="dash-horizontal-chart"><span className="dash-horizontal-axis-title">{axisLabel}</span><div className="dash-horizontal-bars" style={{gridTemplateRows:`repeat(${Math.max(data.length,1)},1fr)`,backgroundImage:`repeating-linear-gradient(90deg,transparent 0,transparent calc(${gridStep}% - 1px),#e5e9ea calc(${gridStep}% - 1px),#e5e9ea ${gridStep}%)`}}>{data.map((item,i) => <button type="button" key={item.id ?? i} onClick={() => onSelect?.(item.id,item)} aria-label={`${item.label}: ${item.value} ${unit}`}><span>{item.label}</span><i style={{width:`${Math.min(100,Math.max(0,Number(item.value)/ceiling*100))}%`,background:item.color || color}}/></button>)}</div><div className="dash-horizontal-ticks">{marks.map((n,i) => <span key={i}>{Number.isInteger(n) ? n : Number(n.toFixed(1))}</span>)}</div></div>;
}

export interface ShortcutRailProps { groups?: ShortcutGroup[]; onSelect?: (id: string, item: ShortcutItem) => void; ariaLabel?: string }
export function ShortcutRail({ groups = DASHBOARD_SHORTCUTS, onSelect, ariaLabel = 'Dashboard shortcuts' }: ShortcutRailProps) {
  return <aside className="dash-shortcuts" aria-label={ariaLabel}>{groups.map((group,index) => <section key={group.id ?? group.title ?? index}><h3>{group.title}</h3><ul>{group.links.map((link,i) => { const item = typeof link === 'string' ? {id:link,label:link} : link; return <li key={item.id ?? i}>{item.href ? <a href={item.href} onClick={event => { if (onSelect) { event.preventDefault(); onSelect(item.id,item); } }}>{item.label}</a> : <button type="button" onClick={() => onSelect?.(item.id,item)}>{item.label}</button>}</li>; })}</ul></section>)}</aside>;
}

export interface DashboardToolbarProps {
  domains?: DirectoryOption[];
  domain?: string;
  defaultDomain?: string;
  onDomainChange?: (value: string, item?: DirectoryOption) => void;
  domainLabel?: string;
  showShortcuts?: boolean;
  onToggleShortcuts?: (show?: boolean) => void;
  onExpand?: () => void;
  settingsLabel?: string;
  expandLabel?: string;
  menuItems?: DashboardMenuItem[];
  onMenuAction?: (id: string, item: DashboardMenuItem) => void;
}
export function DashboardToolbar({ domains = ['ADSELFSERVICE'], domain, defaultDomain, onDomainChange, domainLabel = 'Select Domain to View :', showShortcuts = true, onToggleShortcuts, onExpand, settingsLabel = 'Dashboard settings', expandLabel = 'Expand dashboard', menuItems, onMenuAction }: DashboardToolbarProps) {
  const [menu, setMenu] = useState(false);
  const actions = menuItems || [{id:'embed',label:'Embed Dashboard'},{id:'updater',label:'Dashboard Updater'},{id:'shortcuts',label:`${showShortcuts ? 'Hide' : 'Show'} Shortcut Menu`}];
  return <div className="dash-toolbar"><label htmlFor="dash-domain">{domainLabel}</label><select id="dash-domain" value={domain} defaultValue={domain === undefined ? (defaultDomain ?? (typeof domains[0] === 'string' ? domains[0] : domains[0]?.value)) : undefined} onChange={event => { const item = domains.find(option => (typeof option === 'string' ? option : option.value) === event.target.value); onDomainChange?.(event.target.value,item); }}>{domains.map(option => { const item = typeof option === 'string' ? {value:option,label:option} : option; return <option key={item.value} value={item.value}>{item.label}</option>; })}</select><div className="dash-toolbar-actions"><div className="dash-menu-anchor"><button type="button" aria-label={settingsLabel} aria-expanded={menu} onClick={() => setMenu(!menu)}><Settings size={18}/></button>{menu && <div className="dash-menu">{actions.map(item => <button type="button" key={item.id} onClick={() => { if (item.id === 'shortcuts') onToggleShortcuts?.(); item.onClick?.(item); onMenuAction?.(item.id,item); setMenu(false); }}>{item.label}</button>)}</div>}</div><button type="button" aria-label={expandLabel} onClick={onExpand}><Maximize2 size={17}/></button></div></div>;
}

export interface DashboardLayoutProps { metrics?: React.ReactNode; charts?: React.ReactNode; shortcuts?: React.ReactNode; showShortcuts?: boolean }
export function DashboardLayout({ metrics, charts, shortcuts, showShortcuts = true }: DashboardLayoutProps) {
  return <div className={`dash-layout ${showShortcuts ? '' : 'without-shortcuts'}`}><div className="dash-content"><div className="dash-metrics">{metrics}</div><div className="dash-chart-grid">{charts}</div></div>{showShortcuts && shortcuts}</div>;
}

export interface ExpandedWidgetProps { title?: string | null; onClose: () => void; children?: React.ReactNode; closeLabel?: string }
export function ExpandedWidget({ title, onClose, children, closeLabel = 'Close expanded widget' }: ExpandedWidgetProps) {
  if (!title) return null;
  return <div className="dash-overlay" role="presentation" onMouseDown={onClose}><div className="dash-expanded" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}><div className="dash-expanded-heading"><strong>{title}</strong><button type="button" aria-label={closeLabel} onClick={onClose}><X size={18}/></button></div>{children}</div></div>;
}
