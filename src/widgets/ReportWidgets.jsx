import React, { useEffect, useMemo, useState } from 'react';
import { AlarmClock, ChevronDown, ChevronRight, CircleHelp, Info, Search } from 'lucide-react';
import '../reports/reports.css';

export const REPORT_GROUPS = [
  { label:'Active Directory Reports', items:[['2','Locked Out Users Report'],['3','Soon-To-Expire Password Users Report'],['4','Password Expired Users Report']] },
  { label:'Password Self-Service Reports', items:[['6','Reset Password Audit Report'],['7','Unlock Account Audit Report'],['1202','GINA/Mac/Linux Agent Reset Password Audit Report'],['1203','GINA/Mac/Linux Agent Unlock Account Audit Report'],['8','Self-Update Audit Report'],['9','Change Password Audit Report'],['1204','Password/Account Expiry Notifications Delivery Report']] },
  { label:'MFA Reports', items:[['15','MFA Enrolled Users Report'],['16','MFA Non-Enrolled Users Report'],['1206','MFA Enrollment Audit Report'],['1207','MFA Usage Audit Report'],['1208','MFA Usage for Machines/VPN/OWA'],['1209','MFA Usage from Mobile Devices'],['1210','MFA Failures Audit Report'],['1211','MFA Trusted Browser Report'],['1212','MFA Trusted Machines Report'],['18','Security Questions Report'],['1213','Backup Code Usage Report'],['301','Offline MFA Enrolled Machines Report'],['601','FIDO2 Passkeys Report'],['13','Blocked Users Report']] },
  { label:'GINA/Mac/Linux Agent Reports', items:[['1215','Agent Installed Machines Report'],['1216','Agent Installation Failures Report']] },
  { label:'Other Reports', items:[['12','User Attempts Audit Report'],['17','Licensed Users Report'],['10','Notification Delivery Report'],['19','Push Registered Devices Report'],['901','Application Access Audit Report'],['902','JIT Provisioning Audit Report']] },
];

export const normalizeReport = item => Array.isArray(item) ? {id:item[0],label:item[1]} : item;

export function ReportNavigation({ groups = REPORT_GROUPS, selected, defaultSelected, onSelect, searchPlaceholder = 'Search Report', searchLabel = 'Search Report', emptyLabel = 'No matching reports', ariaLabel = 'Report categories', onSearchChange }) {
  const [query, setQuery] = useState('');
  const [localSelected, setLocalSelected] = useState(defaultSelected ?? (groups[0]?.items[0] && normalizeReport(groups[0].items[0]).id));
  const currentSelected = selected ?? localSelected;
  const selectedGroup = groups.find(group => group.items.some(item => normalizeReport(item).id === currentSelected))?.label || groups[0]?.label;
  const [open, setOpen] = useState(selectedGroup);
  useEffect(() => setOpen(selectedGroup), [selectedGroup]);
  const visibleGroups = useMemo(() => groups.map(group => ({...group, items:group.items.map(normalizeReport).filter(item => item.label.toLowerCase().includes(query.toLowerCase()))})).filter(group => !query || group.items.length), [groups,query]);
  return <div className="report-navigation"><label className="report-search"><Search size={15}/><input aria-label={searchLabel} placeholder={searchPlaceholder} value={query} onChange={e => {setQuery(e.target.value);onSearchChange?.(e.target.value);}}/></label><nav aria-label={ariaLabel}>{visibleGroups.map(group => <div key={group.id ?? group.label}><button type="button" className="report-nav-group" aria-expanded={query ? true : open === group.label} onClick={() => setOpen(open === group.label ? '' : group.label)}>{group.label}{query || open === group.label ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}</button>{(query || open === group.label) && group.items.map(item => <button type="button" key={item.id} className={`report-nav-item ${currentSelected === item.id ? 'is-active' : ''}`} onClick={() => {if (selected === undefined) setLocalSelected(item.id);onSelect?.(item.id,item);}}>{item.label}</button>)}</div>)}</nav>{query && !visibleGroups.length && <div className="report-search-empty">{emptyLabel}</div>}</div>;
}

export function ReportCategoryBar({ groups = REPORT_GROUPS, selected, defaultSelected, onSelect, ariaLabel = 'Report group menu' }) {
  const [open, setOpen] = useState('');
  const [localSelected, setLocalSelected] = useState(defaultSelected ?? (groups[0]?.items[0] && normalizeReport(groups[0].items[0]).id));
  const currentSelected = selected ?? localSelected;
  return <nav className="report-category-bar" aria-label={ariaLabel}>{groups.map(group => <div className="report-category" key={group.id ?? group.label}><button type="button" aria-expanded={open === group.label} onClick={() => setOpen(open === group.label ? '' : group.label)}>{group.label}<ChevronDown size={10}/></button>{open === group.label && <div className="report-category-menu">{group.items.map((raw,i) => {const item = normalizeReport(raw);return <button type="button" key={item.id ?? i} className={currentSelected === item.id ? 'is-active' : ''} onClick={() => { if (selected === undefined) setLocalSelected(item.id); onSelect?.(item.id,item); setOpen(''); }}>{item.label}</button>;})}</div>}</div>)}</nav>;
}

export function ReportFilters({ domains = ['ADSELFSERVICE'], domain, defaultDomain, onDomainChange, ouOptions = ['All OU','Users'], ou, defaultOu, onOuChange, labels = {}, onGenerate, onStop, generating = false }) {
  const [ouOpen, setOuOpen] = useState(false);
  const [localOu, setLocalOu] = useState(defaultOu ?? (typeof ouOptions[0] === 'string' ? ouOptions[0] : ouOptions[0]?.value));
  const selectedOu = ou ?? localOu;
  return <div className="report-filters"><div className="report-filter-row"><label htmlFor="report-domain">{labels.domain || 'Select Domain'}</label><select id="report-domain" value={domain} defaultValue={domain === undefined ? (defaultDomain ?? (typeof domains[0] === 'string' ? domains[0] : domains[0]?.value)) : undefined} onChange={event => { const value = event.target.value; const item = domains.map(raw => typeof raw === 'string' ? {value:raw,label:raw} : raw).find(option => option.value === value); onDomainChange?.(value,item); }}>{domains.map(raw => { const item = typeof raw === 'string' ? {value:raw,label:raw} : raw; return <option key={item.value} value={item.value}>{item.label}</option>; })}</select><button type="button" className="report-ou-current" onClick={() => setOuOpen(!ouOpen)}>{selectedOu}<ChevronDown size={11}/></button><button type="button" className="report-ou-link" onClick={() => setOuOpen(!ouOpen)}>{labels.selectOu || 'Select OU'}</button></div>{ouOpen && <div className="report-ou-picker"><strong>{labels.selectOu || 'Select OU'}</strong>{ouOptions.map(raw => {const item = typeof raw === 'string' ? {value:raw,label:raw} : raw;return <label key={item.value}><input type="radio" name="report-ou" checked={selectedOu === item.value} onChange={() => {setLocalOu(item.value);onOuChange?.(item.value,item);setOuOpen(false);}}/> {item.label}</label>;})}</div>}<div className="report-filter-actions"><button type="button" className="report-generate" onClick={onGenerate} disabled={generating}>{labels.generate || 'Generate'}</button><button type="button" className="report-stop" onClick={onStop} disabled={!generating}>{labels.stop || 'Stop'}</button></div></div>;
}

export function ReportResults({ status = 'empty', emptyMessage = 'No Data Available', loadingMessage = 'Generating report…', children }) {
  return <div className="report-results" role="status">{children !== undefined ? children : (status === 'loading' ? <span>{loadingMessage}</span> : <span><Info size={13}/> {emptyMessage}</span>)}</div>;
}

export function ReportPageHeading({ title, onSchedule, scheduleLabel = 'Schedule Reports', helpText, action }) {
  return <header className="report-page-heading"><h1>{title} {helpText !== null && <CircleHelp size={12} strokeWidth={1.3} aria-label={helpText || `Help for ${title}`}/>}</h1>{action || <button type="button" onClick={onSchedule}><AlarmClock size={13}/> {scheduleLabel}</button>}</header>;
}
