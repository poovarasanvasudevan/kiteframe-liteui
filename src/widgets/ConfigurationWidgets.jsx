import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Copy, KeyRound, LockKeyhole, Pencil, Plus, Search, Settings, Trash2, UserRoundPen } from 'lucide-react';
import { CollapsibleSidebar } from './Shell';
import '../configuration/configuration.css';

export const CONFIG_GROUPS = [
  { label:'Self-Service', items:[{id:'policy',label:'Policy Configuration'},{id:'mfa',label:'Multi-factor Authentication'},{id:'expiry',label:'Password Expiration Notification'},{id:'enforcer',label:'Password Policy Enforcer'},{id:'sync',label:'Password Sync/Single Sign On'},{id:'conditional',label:'Conditional Access'},{id:'directory',label:'Directory Self Service'}] },
  { label:'Administrative Tools', items:[{id:'enrollment',label:'Quick Enrollment'},{id:'agent',label:'GINA/Mac/Linux (Ctrl+Alt+Del)'},{id:'mobile',label:'Mobile App Deployment'},{id:'approval',label:'Approval Workflow'},{id:'technician',label:'Technician'}] },
  { label:'Security Center', items:[{id:'hardening',label:'Security Hardening'},{id:'strengtheners',label:'Password Strengtheners'},{id:'questions',label:'Security Q&A Strengtheners'},{id:'anti-hacking',label:'Anti-Hacking System'}] },
];

export const POLICY_FEATURES = [
  {label:'Reset Password',icon:KeyRound}, {label:'Unlock Account',icon:LockKeyhole}, {label:'Change Password',icon:Settings}, {label:'Self Update',icon:UserRoundPen},
];

export const DEMO_POLICIES = [
  {name:'Selfservice Users',permissions:'Reset Password, Unlock Account, Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 01:43 PM'},
  {name:'Endpoint MFA Users',permissions:'Reset Password, Unlock Account, Change Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'OWA MFA Users',permissions:'Reset Password, Unlock Account',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:38 AM'},
  {name:'VPN MFA Users',permissions:'Unlock Account, Self Update, Change Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'Remote Users',permissions:'Reset Password, Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:39 AM'},
  {name:'System Admins',permissions:'Reset Password',modifiedBy:'operator (ADSelfService Plus Authentication)',modified:'2025/07/08 07:28 AM'},
  {name:'Technical Support',permissions:'Self Update, Change Password',modifiedBy:'admin (ADSelfService Plus Authentication)',modified:'2025/04/05 11:40 AM'},
];

export const POLICY_COLUMNS = [
  {key:'actions',label:'Actions'}, {key:'advanced',label:'Advanced'}, {key:'name',label:'Policy Name'},
  {key:'permissions',label:'Permissions'}, {key:'domain',label:'Domain Name'},
  {key:'modifiedBy',label:'Last Modified By'}, {key:'modified',label:'Last Modified Time'},
];

export function ConfigurationSidebar({ groups = CONFIG_GROUPS, selected, defaultSelected, onSelect, initialOpen }) {
  return <CollapsibleSidebar groups={groups} selected={selected} defaultSelected={defaultSelected} onSelect={onSelect} initialOpen={initialOpen}/>;
}

export function ConfigurationHeader({ title, mode = 'Password Self-Service Modes', onModeChange, helpText, action }) {
  return <div className="config-heading"><h1>{title} {helpText !== null && <span title={helpText || `Help for ${title}`}>ⓘ</span>}</h1>{action || <button type="button" onClick={() => onModeChange?.(mode)}>{mode}<ChevronDown size={11}/></button>}</div>;
}

export function PolicyFeatureStrip({ title = 'Self-Service Features', features = POLICY_FEATURES, instruction, onFeatureSelect }) {
  return <section className="config-feature-strip" aria-label={title}><h2>{title}</h2><div className="config-features">{features.map(({id,label,icon:Icon = Settings},index) => <div key={id ?? label ?? index}>{onFeatureSelect ? <button type="button" onClick={() => onFeatureSelect(id ?? label,{id,label,icon:Icon})}><Icon size={20} strokeWidth={2}/><span>{label}</span></button> : <><Icon size={20} strokeWidth={2}/><span>{label}</span></>}</div>)}</div><p>{instruction === undefined ? <>Click "Add New Policy" Button to add a new policy. To edit an existing policy, click on <Pencil size={12}/> icon in the Actions column.</> : instruction}</p></section>;
}

export function PolicyToolbar({ title = 'Available Policies', addLabel = 'Add New Policy', searchLabel = 'Search policies', count = 0, page, defaultPage = 1, pageSize = 25, onPageChange, onAdd, query, defaultQuery = '', onQueryChange, labels = {} }) {
  const [localPage, setLocalPage] = useState(defaultPage);
  const [localQuery, setLocalQuery] = useState(defaultQuery);
  const currentPage = page ?? localPage;
  const currentQuery = query ?? localQuery;
  const pages = Math.max(1,Math.ceil(count/pageSize));
  const first = count ? (currentPage-1)*pageSize+1 : 0;
  const last = Math.min(currentPage*pageSize,count);
  const changePage = next => {if (page === undefined) setLocalPage(next);onPageChange?.(next);};
  return <><div className="config-table-title"><h2>{title}</h2><button type="button" onClick={onAdd}><Plus size={13}/> {addLabel}</button></div><div className="config-table-tools"><label><Search size={15}/><input aria-label={searchLabel} value={currentQuery} onChange={event => {if (query === undefined) setLocalQuery(event.target.value);onQueryChange?.(event.target.value);}}/></label><div className="config-page-controls"><button type="button" disabled={currentPage <= 1} aria-label={labels.first || "First page"} onClick={() => changePage(1)}><ChevronsLeft size={12}/></button><button type="button" disabled={currentPage <= 1} aria-label={labels.previous || "Previous page"} onClick={() => changePage(currentPage-1)}><ChevronLeft size={12}/></button><span>{labels.range ? labels.range(first,last,count) : `${first}-${last} of ${count}`}</span><button type="button" disabled={currentPage >= pages} aria-label={labels.next || "Next page"} onClick={() => changePage(currentPage+1)}><ChevronRight size={12}/></button><button type="button" disabled={currentPage >= pages} aria-label={labels.last || "Last page"} onClick={() => changePage(pages)}><ChevronsRight size={12}/></button></div></div></>;
}

export function PolicyTable({ policies = DEMO_POLICIES, columns = POLICY_COLUMNS, defaultDomain = 'ADSELFSERVICE', emptyMessage = 'No Data Available', actionLabels = {}, onEdit, onDelete, onCopy, renderCell, getRowId = policy => policy.id ?? policy.name }) {
  const cell = (policy,key) => { if (renderCell) {const custom = renderCell(policy,key);if (custom !== undefined) return custom;} if (key === 'actions') return <div className="config-actions"><button type="button" aria-label={`${actionLabels.edit || 'Edit'} ${policy.name}`} onClick={() => onEdit?.(policy)}><Pencil size={12}/></button><button type="button" aria-label={`${actionLabels.delete || 'Delete'} ${policy.name}`} onClick={() => onDelete?.(policy)}><Trash2 size={12}/></button><button type="button" aria-label={`${actionLabels.copy || 'Copy'} ${policy.name}`} onClick={() => onCopy?.(policy)}><Copy size={12}/></button></div>; if (key === 'advanced') return <button type="button" aria-label={`${actionLabels.advanced || 'Advanced settings for'} ${policy.name}`} onClick={() => onEdit?.(policy)}><Settings size={17}/></button>; return key === 'domain' ? (policy.domain ?? defaultDomain) : policy[key]; };
  return <div className="config-policy-table-wrap"><table className={`config-policy-table ${columns.length === 7 ? 'is-reference' : ''}`}><thead><tr>{columns.map(column => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{policies.length ? policies.map(policy => <tr key={getRowId(policy)}>{columns.map(column => <td key={column.key} title={column.key === 'modifiedBy' ? policy.modifiedBy : undefined}>{cell(policy,column.key)}</td>)}</tr>) : <tr><td colSpan={columns.length} className="config-empty">{emptyMessage}</td></tr>}</tbody></table></div>;
}
