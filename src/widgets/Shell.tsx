import type * as React from 'react';
import { useEffect, useState } from 'react';
import { Bell, BookOpen, ChevronDown, ChevronRight, Download, Grid3X3, Lightbulb, MessagesSquare, PhoneCall, Search, Send, Settings, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './Primitives';

export type NavigationSection = string | { id: string; label: string };
export interface NavigationItem { id: string; label: string }
export interface NavigationGroup { id?: string; label: string; items: NavigationItem[] }
export type DirectoryOption = string | { value: string; label: string };
export type UtilityItem = string | { id?: string; label: string; onClick?: (item: Exclude<UtilityItem, string>) => void };
export type FooterIconName = 'book' | 'lightbulb' | 'send' | 'messages' | 'phone';
export interface FooterItemConfig { id: string; label: string; href?: string; icon?: FooterIconName | LucideIcon; iconColor?: string; iconSize?: number }
export type FooterItem = string | FooterItemConfig;

export const MAIN_SECTIONS: NavigationSection[] = ['Dashboard', 'Reports', 'Configuration', 'Admin', 'Support'];
export const FOOTER_LINKS: FooterItem[] = [
  { id: 'guide', label: 'Admin Guide', icon: 'book', iconColor: '#3188b5', iconSize: 12 },
  { id: 'features', label: 'Need Features', icon: 'lightbulb', iconColor: '#529d73', iconSize: 12 },
  { id: 'issue', label: 'Report an Issue', icon: 'send', iconColor: '#e67860', iconSize: 12 },
  { id: 'forums', label: 'User Forums', icon: 'messages', iconColor: '#dc7274', iconSize: 12 },
  { id: 'toll-free', label: 'Toll free : +1-844-245-1104', icon: 'phone', iconColor: '#74a746', iconSize: 12 },
  { id: 'direct-phone', label: 'Direct Phone : +1-408-916-9890', icon: 'phone', iconColor: '#74a746', iconSize: 12 },
];
const FOOTER_ICONS: Record<FooterIconName, LucideIcon> = { book: BookOpen, lightbulb: Lightbulb, send: Send, messages: MessagesSquare, phone: PhoneCall };

export interface TopNavigationProps {
  sections?: NavigationSection[];
  active?: string;
  onChange?: (id: string, item: NavigationItem) => void;
  ariaLabel?: string;
}
export function TopNavigation({ sections = MAIN_SECTIONS, active = 'Admin', onChange, ariaLabel = 'Main navigation' }: TopNavigationProps) {
  return <nav className="ad-main-nav" aria-label={ariaLabel}>{sections.map(raw => { const section = typeof raw === 'string' ? { id: raw, label: raw } : raw; return <button key={section.id} type="button" className={section.id === active ? 'is-active' : ''} aria-current={section.id === active ? 'page' : undefined} onClick={() => onChange?.(section.id, section)}>{section.label}</button>; })}</nav>;
}

export interface ShellHeaderProps {
  brand?: string;
  brandIcon?: React.ReactNode;
  showBrandOrbit?: boolean;
  sections?: NavigationSection[];
  navigationLabel?: string;
  activeSection?: string;
  onSectionChange?: (id: string, item: NavigationItem) => void;
  directories?: DirectoryOption[];
  directory?: string;
  defaultDirectory?: string;
  onDirectoryChange?: (value: string, item: DirectoryOption) => void;
  showDownload?: boolean;
  downloadLabel?: string;
  onDownload?: () => void;
  utilityItems?: UtilityItem[];
  showNotifications?: boolean;
  notifications?: number;
  notificationLabel?: string;
  onNotificationsClick?: () => void;
  showUserMenu?: boolean;
  userMenuLabel?: string;
  onUserClick?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSettings?: boolean;
  settingsLabel?: string;
  onSettingsClick?: () => void;
  rightContent?: React.ReactNode;
}
export function ShellHeader({ brand = 'ADSelfService Plus', brandIcon, showBrandOrbit = true, sections = MAIN_SECTIONS, navigationLabel = 'Main navigation', activeSection = 'Admin', onSectionChange, directories = ['Active Directory','Microsoft Entra ID'], directory, defaultDirectory, onDirectoryChange, showDownload = true, downloadLabel = 'Download Now', onDownload, utilityItems = ['License','Talk Back'], showNotifications = true, notifications = 2, notificationLabel, onNotificationsClick, showUserMenu = true, userMenuLabel = 'User menu', onUserClick, showSearch = true, searchPlaceholder = 'Search Employee', searchLabel = 'Search Employee', searchValue, onSearchChange, showSettings = true, settingsLabel = 'Domain Settings', onSettingsClick, rightContent }: ShellHeaderProps) {
  const initialDirectory = defaultDirectory ?? (typeof directories[0] === 'string' ? directories[0] : directories[0]?.value);
  const [localDirectory, setLocalDirectory] = useState(initialDirectory);
  const [localSearch, setLocalSearch] = useState('');
  const currentDirectory = directory ?? localDirectory;
  const directoryItem = directories.find(item => (typeof item === 'string' ? item : item.value) === currentDirectory);
  const currentDirectoryLabel = typeof directoryItem === 'string' ? directoryItem : (directoryItem?.label || currentDirectory);
  const currentSearch = searchValue ?? localSearch;
  const switchDirectory = () => {
    if (!directories.length) return;
    const index = directories.findIndex(item => (typeof item === 'string' ? item : item.value) === currentDirectory);
    const next = directories[(index + 1) % directories.length];
    const value = typeof next === 'string' ? next : next.value;
    if (directory === undefined) setLocalDirectory(value);
    onDirectoryChange?.(value, next);
  };
  return <header className="ad-header"><div className="ad-header-top"><div className="ad-brand">{brandIcon === undefined ? <Grid3X3 size={19} strokeWidth={2.4}/> : brandIcon}<span>{brand}</span>{showBrandOrbit && <span className="ad-brand-orbit"/>}</div>{directories.length > 0 && <button type="button" className="ad-directory" onClick={switchDirectory}>{currentDirectoryLabel}<ChevronDown size={12}/></button>}{showDownload && <Button variant="download" icon={Download} onClick={onDownload}>{downloadLabel}</Button>}<div className="ad-header-right">{utilityItems.map((raw,index) => { const item = typeof raw === 'string' ? { label: raw } : raw; return <button type="button" key={item.id ?? item.label ?? index} onClick={() => item.onClick?.(item)}>{item.label}</button>; })}{showNotifications && <button type="button" className="ad-bell" aria-label={notificationLabel || `${notifications} notifications`} onClick={onNotificationsClick}><Bell size={14}/>{notifications > 0 && <i>{notifications}</i>}</button>}{showUserMenu && <button type="button" aria-label={userMenuLabel} onClick={onUserClick}><UserRound size={16}/><ChevronDown size={11}/></button>}{rightContent}</div></div><div className="ad-header-bottom"><TopNavigation sections={sections} ariaLabel={navigationLabel} active={activeSection} onChange={onSectionChange}/>{showSearch && <div className="ad-header-search"><Search size={12}/><input aria-label={searchLabel} placeholder={searchPlaceholder} value={currentSearch} onChange={event => { if (searchValue === undefined) setLocalSearch(event.target.value); onSearchChange?.(event.target.value); }}/></div>}{showSettings && <button type="button" className="ad-domain-settings" onClick={onSettingsClick}><Settings size={12}/> {settingsLabel}</button>}</div></header>;
}

export interface CollapsibleSidebarProps {
  groups?: NavigationGroup[];
  selected?: string;
  defaultSelected?: string;
  onSelect?: (id: string, item: NavigationItem) => void;
  initialOpen?: string;
  open?: string;
  onOpenChange?: (label: string, group: NavigationGroup) => void;
  ariaLabel?: string;
}
export function CollapsibleSidebar({ groups = [], selected, defaultSelected, onSelect, initialOpen, open, onOpenChange, ariaLabel = 'Section pages' }: CollapsibleSidebarProps) {
  const [localSelected, setLocalSelected] = useState(defaultSelected ?? groups[0]?.items[0]?.id);
  const currentSelected = selected ?? localSelected;
  const selectedGroup = groups.find(group => group.items.some(item => item.id === currentSelected))?.label;
  const [openGroup, setOpenGroup] = useState(initialOpen || selectedGroup || groups[0]?.label || '');
  useEffect(() => { if (selectedGroup) setOpenGroup(selectedGroup); }, [selectedGroup]);
  const expanded = open ?? openGroup;
  return <nav aria-label={ariaLabel}>{groups.map(group => <div className="ad-nav-group" key={group.id ?? group.label}><button type="button" className="ad-nav-heading" onClick={() => { const next = expanded === group.label ? '' : group.label; if (open === undefined) setOpenGroup(next); onOpenChange?.(next,group); }} aria-expanded={expanded === group.label}>{group.label}{expanded === group.label ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}</button>{expanded === group.label && <div className="ad-nav-items">{group.items.map(item => <button type="button" key={item.id} className={`ad-nav-item ${currentSelected === item.id ? 'is-active' : ''}`} aria-current={currentSelected === item.id ? 'page' : undefined} onClick={() => { if (selected === undefined) setLocalSelected(item.id); onSelect?.(item.id,item); }}>{item.label}</button>)}</div>}</div>)}</nav>;
}

export interface ShellFooterProps { items?: FooterItem[]; onItemSelect?: (id: string, item: FooterItemConfig) => void; children?: React.ReactNode }
export function ShellFooter({ items = FOOTER_LINKS, onItemSelect, children }: ShellFooterProps) {
  return <footer className="ad-footer">{items.map((raw,index) => {
    const item: FooterItemConfig = typeof raw === 'string' ? { id: raw, label: raw } : raw;
    const Icon = typeof item.icon === 'string' ? FOOTER_ICONS[item.icon] : item.icon;
    const content = <>{Icon && <Icon className="ad-footer-icon" aria-hidden="true" size={item.iconSize ?? 12} color={item.iconColor}/>}<span className="ad-footer-item-label">{item.label}</span></>;
    return item.href ? <a className="ad-footer-item" key={item.id ?? index} href={item.href}>{content}</a> : <button className="ad-footer-item" type="button" key={item.id ?? index} onClick={() => onItemSelect?.(item.id,item)}>{content}</button>;
  })}{children}</footer>;
}

export interface AppShellProps {
  activeSection?: string;
  onSectionChange?: (id: string, item: NavigationItem) => void;
  sidebar?: React.ReactNode;
  sidebarLabel?: string;
  hideSidebar?: boolean;
  mainClassName?: string;
  headerProps?: ShellHeaderProps;
  footerProps?: ShellFooterProps;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
export function AppShell({ activeSection = 'Admin', onSectionChange, sidebar, sidebarLabel, hideSidebar = false, mainClassName = '', headerProps = {}, footerProps = {}, header, footer, children }: AppShellProps) {
  return <div className="ad-shell">{header || <ShellHeader {...headerProps} activeSection={activeSection} onSectionChange={onSectionChange}/>}<div className="ad-workspace">{!hideSidebar && <aside className="ad-sidebar" aria-label={sidebarLabel || `${activeSection} navigation`}>{sidebar}</aside>}<main className={`ad-main ${mainClassName}`}>{children}</main></div>{footer || <ShellFooter {...footerProps}/>}</div>;
}

export interface AdminShellProps extends AppShellProps { groups?: NavigationGroup[]; screen?: string; onScreenChange?: (id: string, item: NavigationItem) => void }
export function AdminShell({ groups = [], screen, onScreenChange, children, activeSection = 'Admin', onSectionChange, sidebar, hideSidebar = false, mainClassName = '', ...shellProps }: AdminShellProps) {
  return <AppShell activeSection={activeSection} onSectionChange={onSectionChange} sidebar={sidebar || <CollapsibleSidebar groups={groups} selected={screen} onSelect={onScreenChange}/>} hideSidebar={hideSidebar} mainClassName={mainClassName} {...shellProps}>{children}</AppShell>;
}
