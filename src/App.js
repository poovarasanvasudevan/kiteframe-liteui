import React, { useState } from 'react';
import { AdminShell } from './widgets/Shell';
import { ADMIN_GROUPS, AdminScreen } from './admin/screens';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { ReportNavigation } from './widgets/ReportWidgets';
import { ConfigurationSidebar } from './widgets/ConfigurationWidgets';
import './App.css';

export default function App() {
  const [screen, setScreen] = useState('login');
  const [section, setSection] = useState('Admin');
  const [report, setReport] = useState('2');
  const [configuration, setConfiguration] = useState('policy');
  const openReport = id => { setReport(id); setSection('Reports'); };
  return <AdminShell key={section} groups={section === 'Admin' ? ADMIN_GROUPS : []} screen={screen} onScreenChange={setScreen} activeSection={section} onSectionChange={next => { if (['Admin', 'Dashboard', 'Reports', 'Configuration'].includes(next)) setSection(next); }} hideSidebar={section === 'Dashboard'} sidebar={section === 'Reports' ? <ReportNavigation selected={report} onSelect={setReport}/> : section === 'Configuration' ? <ConfigurationSidebar selected={configuration} onSelect={setConfiguration}/> : undefined} mainClassName={section === 'Dashboard' ? 'ad-main--dashboard' : section === 'Reports' ? 'ad-main--reports' : section === 'Configuration' ? 'ad-main--configuration' : ''}>
    {section === 'Dashboard' ? <DashboardPage onReportSelect={openReport}/> : section === 'Reports' ? <ReportsPage selected={report} onSelect={setReport}/> : section === 'Configuration' ? <ConfigurationPage selected={configuration}/> : <AdminScreen screen={screen}/>}
  </AdminShell>;
}
