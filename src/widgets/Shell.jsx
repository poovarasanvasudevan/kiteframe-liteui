import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, ChevronRight, Download, Grid3X3, Search, Settings, UserRound } from 'lucide-react';
import { Button } from './Primitives';

export const MAIN_SECTIONS = ['Dashboard', 'Reports', 'Configuration', 'Admin', 'Support'];
export const FOOTER_LINKS = ['Admin Guide', 'Need Features', 'Report an Issue', 'User Forums', 'Toll free : +1-844-245-1104', 'Direct Phone : +1-408-916-9890'];

export function TopNavigation({ sections = MAIN_SECTIONS, active = 'Admin', onChange, ariaLabel = 'Main navigation' }) {
  return <nav className="ad-main-nav" aria-label={ariaLabel}>{sections.map(raw => {const section = typeof raw === 'string' ? {id:raw,label:raw} : raw;return <button key={section.id} type="button" className={section.id === active ? 'is-active' : ''} aria-current={section.id === active ? 'page' : undefined} onClick={() => onChange?.(section.id,section)}>{section.label}</button>;})}</nav>;
}

export function ShellHeader({ brand = 'ADSelfService Plus', brandIcon, showBrandOrbit = true, sections = MAIN_SECTIONS, navigationLabel = 'Main navigation', activeSection = 'Admin', onSectionChange, directories = ['Active Directory','Microsoft Entra ID'], directory, defaultDirectory, onDirectoryChange, showDownload = true, downloadLabel = 'Download Now', onDownload, utilityItems = ['License','Talk Back'], showNotifications = true, notifications = 2, notificationLabel, onNotificationsClick, showUserMenu = true, userMenuLabel = 'User menu', onUserClick, showSearch = true, searchPlaceholder = 'Search Employee', searchLabel = 'Search Employee', searchValue, onSearchChange, showSettings = true, settingsLabel = 'Domain Settings', onSettingsClick, rightContent }) {
  const [localDirectory, setLocalDirectory] = useState(defaultDirectory ?? directories[0]);
  const [localSearch, setLocalSearch] = useState('');
  const currentDirectory = directory ?? localDirectory;
  const directoryItem = directories.find(item => (typeof item === 'string' ? item : item.value) === currentDirectory);
  const currentDirectoryLabel = typeof directoryItem === 'string' ? directoryItem : (directoryItem?.label || currentDirectory);
  const currentSearch = searchValue ?? localSearch;
  const switchDirectory = () => { const index = directories.findIndex(item => (typeof item === 'string' ? item : item.value) === currentDirectory); const next = directories[(index+1)%directories.length]; const value = typeof next === 'string' ? next : next?.value; if (directory === undefined) setLocalDirectory(value); onDirectoryChange?.(value,next); };
  return <header className="ad-header"><div className="ad-header-top"><div className="ad-brand">{brandIcon === undefined ? <Grid3X3 size={19} strokeWidth={2.4}/> : brandIcon}<span>{brand}</span>{showBrandOrbit && <span className="ad-brand-orbit"/>}</div>{directories.length > 0 && <button type="button" className="ad-directory" onClick={switchDirectory}>{currentDirectoryLabel}<ChevronDown size={12}/></button>}{showDownload && <Button variant="download" icon={Download} onClick={onDownload}>{downloadLabel}</Button>}<div className="ad-header-right">{utilityItems.map((raw,index) => {const item = typeof raw === 'string' ? {label:raw} : raw;return <button type="button" key={item.id ?? item.label ?? index} onClick={() => item.onClick?.(item)}>{item.label}</button>;})}{showNotifications && <button type="button" className="ad-bell" aria-label={notificationLabel || `${notifications} notifications`} onClick={onNotificationsClick}><Bell size={14}/>{notifications > 0 && <i>{notifications}</i>}</button>}{showUserMenu && <button type="button" aria-label={userMenuLabel} onClick={onUserClick}><UserRound size={16}/><ChevronDown size={11}/></button>}{rightContent}</div></div><div className="ad-header-bottom"><TopNavigation sections={sections} ariaLabel={navigationLabel} active={activeSection} onChange={onSectionChange}/>{showSearch && <div className="ad-header-search"><Search size={12}/><input aria-label={searchLabel} placeholder={searchPlaceholder} value={currentSearch} onChange={event => {if (searchValue === undefined) setLocalSearch(event.target.value);onSearchChange?.(event.target.value);}}/></div>}{showSettings && <button type="button" className="ad-domain-settings" onClick={onSettingsClick}><Settings size={12}/> {settingsLabel}</button>}</div></header>;
}

export function CollapsibleSidebar({ groups = [], selected, defaultSelected, onSelect, initialOpen, open, onOpenChange, ariaLabel = 'Section pages' }) {
  const [localSelected, setLocalSelected] = useState(defaultSelected ?? groups[0]?.items[0]?.id);
  const currentSelected = selected ?? localSelected;
  const selectedGroup = groups.find(group => group.items.some(item => item.id === currentSelected))?.label;
  const [openGroup, setOpenGroup] = useState(initialOpen || selectedGroup || groups[0]?.label || '');
  useEffect(() => { if (selectedGroup) setOpenGroup(selectedGroup); }, [selectedGroup]);
  const expanded = open ?? openGroup;
  return <nav aria-label={ariaLabel}>{groups.map(group => <div className="ad-nav-group" key={group.id ?? group.label}><button type="button" className="ad-nav-heading" onClick={() => {const next = expanded === group.label ? '' : group.label;if (open === undefined) setOpenGroup(next);onOpenChange?.(next,group);}} aria-expanded={expanded === group.label}>{group.label}{expanded === group.label ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}</button>{expanded === group.label && <div className="ad-nav-items">{group.items.map(item => <button type="button" key={item.id} className={`ad-nav-item ${currentSelected === item.id ? 'is-active' : ''}`} aria-current={currentSelected === item.id ? 'page' : undefined} onClick={() => {if (selected === undefined) setLocalSelected(item.id);onSelect?.(item.id,item);}}>{item.label}</button>)}</div>}</div>)}</nav>;
}

export function ShellFooter({ items = FOOTER_LINKS, onItemSelect, children }) {
  return <footer className="ad-footer">{items.map((raw,index) => {const item = typeof raw === 'string' ? {id:raw,label:raw} : raw;return item.href ? <a key={item.id ?? index} href={item.href}>{item.label}</a> : <button type="button" key={item.id ?? index} onClick={() => onItemSelect?.(item.id,item)}>{item.label}</button>;})}{children}</footer>;
}

export function AppShell({ activeSection = 'Admin', onSectionChange, sidebar, sidebarLabel, hideSidebar = false, mainClassName = '', headerProps = {}, footerProps = {}, header, footer, children }) {
  return <div className="ad-shell">{header || <ShellHeader {...headerProps} activeSection={activeSection} onSectionChange={onSectionChange}/>}<div className="ad-workspace">{!hideSidebar && <aside className="ad-sidebar" aria-label={sidebarLabel || `${activeSection} navigation`}>{sidebar}</aside>}<main className={`ad-main ${mainClassName}`}>{children}</main></div>{footer || <ShellFooter {...footerProps}/>}</div>;
}

export function AdminShell({ groups = [], screen, onScreenChange, children, activeSection = 'Admin', onSectionChange, sidebar, hideSidebar = false, mainClassName = '', ...shellProps }) {
  return <AppShell activeSection={activeSection} onSectionChange={onSectionChange} sidebar={sidebar || <CollapsibleSidebar groups={groups} selected={screen} onSelect={onScreenChange}/>} hideSidebar={hideSidebar} mainClassName={mainClassName} {...shellProps}>{children}</AppShell>;
}
