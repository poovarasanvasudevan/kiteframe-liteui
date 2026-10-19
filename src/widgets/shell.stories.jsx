import React, { useState } from 'react';
import { AdminShell, AppShell, CollapsibleSidebar, FOOTER_LINKS, ShellFooter, ShellHeader, TopNavigation } from './Shell';
import { ActionStatus, StoryPreview, source, usePreviewValue } from './stories/StoryPreview';

const sections = [{ id: 'dashboard', label: 'Dashboard' }, { id: 'reports', label: 'Reports' }, { id: 'admin', label: 'Admin' }];
const groups = [{ label: 'Customize', items: [{ id: 'login', label: 'Login settings' }, { id: 'personalize', label: 'Personalize' }] }, { label: 'Product settings', items: [{ id: 'mail', label: 'Mail settings' }] }];
const items = [{ id: 'help', label: 'Admin guide' }, { id: 'feedback', label: 'Feedback' }];
const headerProps = { brand: 'Access Console', sections, directories: ['Production', 'Staging'], utilityItems: [], showBrandOrbit: false, showDownload: false, showNotifications: false, showUserMenu: false };
const meta = { title: 'Widgets/Shell', tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Build an administrator shell from standalone navigation, header, sidebar, and footer components. Change their data in Args and try the controls.' } } } };
export default meta;

export const Navigation = {
  name: 'TopNavigation',
  args: { sections, active: 'dashboard', ariaLabel: 'Product sections' },
  render: NavigationExample,
  parameters: source('<TopNavigation sections={sections} active={section} onChange={setSection} />'),
};
function NavigationExample(args) {
  const [active, setActive] = usePreviewValue(args.active);
  return <StoryPreview><div style={{ background: '#3e4d56', height: 30 }}><TopNavigation {...args} active={active} onChange={setActive}/></div><ActionStatus>Active: {active}</ActionStatus></StoryPreview>;
}

export const Header = {
  name: 'ShellHeader',
  args: { ...headerProps, activeSection: 'dashboard', directory: 'Production', searchValue: '', showSearch: true, searchPlaceholder: 'Search users', settingsLabel: 'Directory settings', showSettings: true, downloadLabel: 'Download now', notifications: 2 },
  render: HeaderExample,
  parameters: source('<ShellHeader brand="Access Console" sections={sections} activeSection={section} onSectionChange={setSection} directories={["Production", "Staging"]} directory={directory} onDirectoryChange={setDirectory} />'),
};
function HeaderExample(args) {
  const [activeSection, setActiveSection] = usePreviewValue(args.activeSection);
  const [directory, setDirectory] = usePreviewValue(args.directory);
  const [searchValue, setSearchValue] = usePreviewValue(args.searchValue);
  const [action, setAction] = useState('');
  return <><ShellHeader {...args} activeSection={activeSection} directory={directory} searchValue={searchValue} onSectionChange={setActiveSection} onDirectoryChange={setDirectory} onSearchChange={setSearchValue} onSettingsClick={() => setAction('Directory settings clicked')} onDownload={() => setAction('Download clicked')} onNotificationsClick={() => setAction('Notifications clicked')} onUserClick={() => setAction('User menu clicked')}/><StoryPreview><ActionStatus>{action || `Section: ${activeSection}`}</ActionStatus></StoryPreview></>;
}

export const Sidebar = {
  name: 'CollapsibleSidebar',
  args: { groups, selected: 'login', open: 'Customize', ariaLabel: 'Admin pages' },
  render: SidebarExample,
  parameters: source('<CollapsibleSidebar groups={groups} selected={screen} onSelect={setScreen} open={openGroup} onOpenChange={setOpenGroup} />'),
};
function SidebarExample(args) {
  const [selected, setSelected] = usePreviewValue(args.selected);
  const [open, setOpen] = usePreviewValue(args.open);
  return <StoryPreview width={280}><div className="ad-sidebar" style={{ width: 260, minHeight: 300 }}><CollapsibleSidebar {...args} selected={selected} open={open} onSelect={setSelected} onOpenChange={setOpen}/></div><ActionStatus>Selected: {selected}</ActionStatus></StoryPreview>;
}

export const Footer = {
  name: 'ShellFooter',
  args: { items: FOOTER_LINKS, children: '' },
  render: FooterExample,
  parameters: source('<ShellFooter items={[{ id: "guide", label: "Admin Guide", icon: "book", iconColor: "#3188b5", iconSize: 12 }]} onItemSelect={(id, item) => console.log(id, item)} />'),
};
function FooterExample(args) {
  const [action, setAction] = useState('');
  return <StoryPreview><ShellFooter {...args} onItemSelect={(_, item) => setAction(`${item.label} clicked`)}/><ActionStatus>{action}</ActionStatus></StoryPreview>;
}

export const ApplicationShell = {
  name: 'AppShell',
  args: { activeSection: 'dashboard', hideSidebar: false, sidebarLabel: 'Workspace pages', headerProps, footerProps: { items }, sidebarGroups: groups, pageTitle: 'Workspace overview', pageDescription: 'Compose a page from reusable widgets.' },
  render: ApplicationShellExample,
  parameters: source('<AppShell activeSection={section} onSectionChange={setSection} headerProps={headerProps} sidebar={<CollapsibleSidebar groups={groups} />}>Page content</AppShell>'),
};
function ApplicationShellExample({ sidebarGroups, pageTitle, pageDescription, ...args }) {
  const [activeSection, setActiveSection] = usePreviewValue(args.activeSection);
  const [selected, setSelected] = useState('login');
  return <AppShell {...args} activeSection={activeSection} onSectionChange={setActiveSection} sidebar={<CollapsibleSidebar groups={sidebarGroups} selected={selected} onSelect={setSelected}/>}><div style={{ padding: 20 }}><h1>{pageTitle}</h1><p>{pageDescription}</p><ActionStatus>Sidebar: {selected}</ActionStatus></div></AppShell>;
}

export const AdministratorShell = {
  name: 'AdminShell',
  args: { groups, screen: 'login', activeSection: 'admin', headerProps, footerProps: { items }, pageTitle: 'Login settings', pageDescription: 'Administrator screen content' },
  render: AdministratorShellExample,
  parameters: source('<AdminShell groups={groups} screen={screen} onScreenChange={setScreen} activeSection="admin" headerProps={headerProps}>Admin page content</AdminShell>'),
};
function AdministratorShellExample({ pageTitle, pageDescription, ...args }) {
  const [screen, setScreen] = usePreviewValue(args.screen);
  const [activeSection, setActiveSection] = usePreviewValue(args.activeSection);
  return <AdminShell {...args} screen={screen} activeSection={activeSection} onScreenChange={setScreen} onSectionChange={setActiveSection}><div style={{ padding: 20 }}><h1>{pageTitle}</h1><p>{pageDescription}</p></div></AdminShell>;
}
