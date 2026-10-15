import React, { useState } from 'react';
import { AdminShell } from '../components/AdminUI';
import { ADMIN_GROUPS, AdminScreen } from './screens';

const meta = { title:'Administrator/Screens', tags:['autodocs'], parameters:{layout:'fullscreen'} };
export default meta;
const show = screen => <AdminShell groups={ADMIN_GROUPS} screen={screen} onScreenChange={()=>{}}><AdminScreen screen={screen}/></AdminShell>;
export const InteractiveAdminShell = { render: () => <InteractiveShellStory/> };
function InteractiveShellStory(){const [screen,setScreen]=useState('login');return <AdminShell groups={ADMIN_GROUPS} screen={screen} onScreenChange={setScreen}><AdminScreen screen={screen}/></AdminShell>}
export const LoginSettings = { render:()=>show('login') };
export const Personalize = { render:()=>show('personalize') };
export const FailoverAndSecureGateway = { render:()=>show('failover') };
export const ReverseProxy = { render:()=>show('reverse') };
export const Connection = { render:()=>show('connection') };
export const MailAndSmsSettings = { render:()=>show('mail') };
export const DashboardUpdater = { render:()=>show('dashboard') };
export const BackupSettings = { render:()=>show('backup') };
export const SiteBasedDcUpdater = { render:()=>show('site') };
export const IntegrationSettings = { render:()=>show('integration') };
export const WindowsService = { render:()=>show('windows') };
export const SecurityAndPrivacy = { render:()=>show('security') };
export const RestrictUsers = { render:()=>show('restrict') };
