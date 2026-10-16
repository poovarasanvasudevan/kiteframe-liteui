import type * as React from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy, KeyRound, LockKeyhole, Pencil, Plus, Search, Settings, Trash2, UserRoundPen, type LucideIcon } from 'lucide-react';
import { CollapsibleSidebar, type NavigationGroup, type NavigationItem } from './Shell';
import '../configuration/configuration.css';

export interface PolicyFeature { id?: string; label: string; icon?: LucideIcon }
export interface PolicyRecord { id?: string; name: string; domain?: string; permissions?: string; modifiedBy?: string; modified?: string; [key: string]: any }
export interface PolicyColumn { key: string; label: string }

export const CONFIG_GROUPS: NavigationGroup[] = [
  { label:'Self-Service', items:[{id:'policy',label:'Policy Configuration'},{id:'mfa',label:'Multi-factor Authentication'},{id:'expiry',label:'Password Expiration Notification'},{id:'enforcer',label:'Password Policy Enforcer'},{id:'sync',label:'Password Sync/Single Sign On'},{id:'conditional',label:'Conditional Access'},{id:'directory',label:'Directory Self Service'}] },
  { label:'Administrative Tools', items:[{id:'enrollment',label:'Quick Enrollment'},{id:'agent',label:'GINA/Mac/Linux (Ctrl+Alt+Del)'},{id:'mobile',label:'Mobile App Deployment'},{id:'approval',label:'Approval Workflow'},{id:'technician',label:'Technician'}] },
  { label:'Security Center', items:[{id:'hardening',label:'Security Hardening'},{id:'strengtheners',label:'Password Strengtheners'},{id:'questions',label:'Security Q&A Strengtheners'},{id:'anti-hacking',label:'Anti-Hacking System'}] },
];
export const POLICY_FEATURES: PolicyFeature[] = [
  {label:'Reset Password',icon:KeyRound}, {label:'Unlock Account',icon:LockKeyhole}, {label:'Change Password',icon:Settings}, {label:'Self Update',icon:UserRoundPen},
];
export const DEMO_POLICIES: PolicyRecord[] = [
  {name:'Selfservice Users',permissions:'Reset Password, Unlock Account, Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 01:43 PM'},
  {name:'Endpoint MFA Users',permissions:'Reset Password, Unlock Account, Change Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'OWA MFA Users',permissions:'Reset Password, Unlock Account',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:38 AM'},
  {name:'VPN MFA Users',permissions:'Unlock Account, Self Update, Change Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'Remote Users',permissions:'Reset Password, Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:39 AM'},
  {name:'System Admins',permissions:'Reset Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'Technical Support',permissions:'Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:40 AM'},
];
export const POLICY_COLUMNS: PolicyColumn[] = [
  {key:'actions',label:'Actions'}, {key:'advanced',label:'Advanced'}, {key:'name',label:'Policy Name'},
  {key:'permissions',label:'Permissions'}, {key:'domain',label:'Domain Name'},
  {key:'modifiedBy',label:'Last Modified By'}, {key:'modified',label:'Last Modified Time'},
];

export interface ConfigurationSidebarProps { groups?: NavigationGroup[]; selected?: string; defaultSelected?: string; onSelect?: (id: string, item: NavigationItem) => void; initialOpen?: string }
export function ConfigurationSidebar({ groups = CONFIG_GROUPS, selected, defaultSelected, onSelect, initialOpen }: ConfigurationSidebarProps) {
  return <CollapsibleSidebar groups={groups} selected={selected} defaultSelected={defaultSelected} onSelect={onSelect} initialOpen={initialOpen}/>;
}

export interface ConfigurationHeaderProps { title: string; mode?: string; onModeChange?: (mode: string) => void; helpText?: string | null; action?: React.ReactNode }
export function ConfigurationHeader({ title, mode = 'Password Self-Service Modes', onModeChange, helpText, action }: ConfigurationHeaderProps) {
  return <div className="config-heading"><h1>{title} {helpText !== null && <span title={helpText || `Help for ${title}`}>ⓘ</span>}</h1>{action || <button type="button" onClick={() => onModeChange?.(mode)}>{mode}<ChevronDown size={11}/></button>}</div>;
}

export interface PolicyFeatureStripProps {
  title?: string;
  features?: PolicyFeature[];
  instruction?: React.ReactNode;
  onFeatureSelect?: (id: string, item: PolicyFeature) => void;
}
export function PolicyFeatureStrip({ title = 'Self-Service Features', features = POLICY_FEATURES, instruction, onFeatureSelect }: PolicyFeatureStripProps) {
  return <section className="config-feature-strip" aria-label={title}><h2>{title}</h2><div className="config-features">{features.map(({id,label,icon:Icon = Settings},index) => <div key={id ?? label ?? index}>{onFeatureSelect ? <button type="button" onClick={() => onFeatureSelect(id ?? label,{id,label,icon:Icon})}><Icon size={20} strokeWidth={2}/><span>{label}</span></button> : <><Icon size={20} strokeWidth={2}/><span>{label}</span></>}</div>)}</div><p>{instruction === undefined ? <>Click "Add New Policy" Button to add a new policy. To edit an existing policy, click on <Pencil size={12}/> icon in the Actions column.</> : instruction}</p></section>;
}

export interface PolicyToolbarLabels { first?: string; previous?: string; next?: string; last?: string; range?: (first: number, last: number, total: number) => string }
export interface PolicyToolbarProps {
  title?: string;
  addLabel?: string;
  searchLabel?: string;
  count?: number;
  page?: number;
  defaultPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onAdd?: () => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (value: string) => void;
  labels?: PolicyToolbarLabels;
}
export function PolicyToolbar({ title = 'Available Policies', addLabel = 'Add New Policy', searchLabel = 'Search policies', count = 0, page, defaultPage = 1, pageSize = 25, onPageChange, onAdd, query, defaultQuery = '', onQueryChange, labels = {} }: PolicyToolbarProps) {
  const [localPage, setLocalPage] = useState(defaultPage);
  const [localQuery, setLocalQuery] = useState(defaultQuery);
  const currentPage = page ?? localPage;
  const currentQuery = query ?? localQuery;
  const pages = Math.max(1,Math.ceil(count/pageSize));
  const first = count ? (currentPage-1)*pageSize+1 : 0;
  const last = Math.min(currentPage*pageSize,count);
  const changePage = (next: number) => { if (page === undefined) setLocalPage(next); onPageChange?.(next); };
  return <><div className="config-table-title"><h2>{title}</h2><button type="button" onClick={onAdd}><Plus size={13}/> {addLabel}</button></div><div className="config-table-tools"><label><Search size={15}/><input aria-label={searchLabel} value={currentQuery} onChange={event => { if (query === undefined) setLocalQuery(event.target.value); onQueryChange?.(event.target.value); }}/></label><div className="config-page-controls"><button type="button" disabled={currentPage <= 1} aria-label={labels.first || 'First page'} onClick={() => changePage(1)}><ChevronsLeft size={12}/></button><button type="button" disabled={currentPage <= 1} aria-label={labels.previous || 'Previous page'} onClick={() => changePage(currentPage-1)}><ChevronLeft size={12}/></button><span>{labels.range ? labels.range(first,last,count) : `${first}-${last} of ${count}`}</span><button type="button" disabled={currentPage >= pages} aria-label={labels.next || 'Next page'} onClick={() => changePage(currentPage+1)}><ChevronRight size={12}/></button><button type="button" disabled={currentPage >= pages} aria-label={labels.last || 'Last page'} onClick={() => changePage(pages)}><ChevronsRight size={12}/></button></div></div></>;
}

export interface PolicyTableProps {
  policies?: PolicyRecord[];
  columns?: PolicyColumn[];
  defaultDomain?: string;
  emptyMessage?: React.ReactNode;
  actionLabels?: { edit?: string; delete?: string; copy?: string; advanced?: string };
  onEdit?: (policy: PolicyRecord) => void;
  onDelete?: (policy: PolicyRecord) => void;
  onCopy?: (policy: PolicyRecord) => void;
  renderCell?: (policy: PolicyRecord, key: string) => React.ReactNode | undefined;
  getRowId?: (policy: PolicyRecord) => React.Key;
}
export function PolicyTable({ policies = DEMO_POLICIES, columns = POLICY_COLUMNS, defaultDomain = 'ADSELFSERVICE', emptyMessage = 'No Data Available', actionLabels = {}, onEdit, onDelete, onCopy, renderCell, getRowId = policy => policy.id ?? policy.name }: PolicyTableProps) {
  const cell = (policy: PolicyRecord, key: string): React.ReactNode => {
    if (renderCell) { const custom = renderCell(policy,key); if (custom !== undefined) return custom; }
    if (key === 'actions') return <div className="config-actions"><button type="button" aria-label={`${actionLabels.edit || 'Edit'} ${policy.name}`} onClick={() => onEdit?.(policy)}><Pencil size={12}/></button><button type="button" aria-label={`${actionLabels.delete || 'Delete'} ${policy.name}`} onClick={() => onDelete?.(policy)}><Trash2 size={12}/></button><button type="button" aria-label={`${actionLabels.copy || 'Copy'} ${policy.name}`} onClick={() => onCopy?.(policy)}><Copy size={12}/></button></div>;
    if (key === 'advanced') return <button type="button" aria-label={`${actionLabels.advanced || 'Advanced settings for'} ${policy.name}`} onClick={() => onEdit?.(policy)}><Settings size={17}/></button>;
    return key === 'domain' ? (policy.domain ?? defaultDomain) : policy[key];
  };
  return <div className="config-policy-table-wrap"><table className={`config-policy-table ${columns.length === 7 ? 'is-reference' : ''}`}><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{policies.length ? policies.map(policy => <tr key={getRowId(policy)}>{columns.map(column => <td key={column.key} title={column.key === 'modifiedBy' ? policy.modifiedBy : undefined}>{cell(policy,column.key)}</td>)}</tr>) : <tr><td colSpan={columns.length} className="config-empty">{emptyMessage}</td></tr>}</tbody></table></div>;
}
