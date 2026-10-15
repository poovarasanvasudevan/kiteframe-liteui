import React, { useState } from 'react';
import { AppShell, CollapsibleSidebar, ShellFooter, ShellHeader, TopNavigation } from './Shell';
import { CONFIG_GROUPS } from './ConfigurationWidgets';

const meta = { title:'Widgets/Shell', tags:['autodocs'], parameters:{layout:'fullscreen'} };
export default meta;
export const Header = { render:() => <ShellHeader activeSection="Dashboard"/> };
export const TopMenu = { render:() => <div style={{background:'#3e4d56',height:30,paddingLeft:10}}><TopNavigation active="Reports"/></div> };
export const CollapsibleMenus = { render:() => <SidebarStory/> };
function SidebarStory(){const [selected,setSelected]=useState('policy');return <div className="ad-sidebar" style={{height:'100vh'}}><CollapsibleSidebar groups={CONFIG_GROUPS} selected={selected} onSelect={setSelected}/></div>}
export const Footer = { render:() => <ShellFooter/> };
export const FullShell = { render:() => <AppShell activeSection="Configuration" sidebar={<CollapsibleSidebar groups={CONFIG_GROUPS} selected="policy"/>}><div style={{padding:20}}>Page content</div></AppShell> };
export const YourAppHeader = { args:{brand:'Acme Console',sections:[{id:'orders',label:'Orders'},{id:'analytics',label:'Analytics'}],activeSection:'orders',directories:['Production','Staging'],showBrandOrbit:false,showDownload:false,utilityItems:[],showNotifications:false,showUserMenu:false,searchPlaceholder:'Find a customer',settingsLabel:'Preferences'}, render:args => <ShellHeader {...args}/> };
export const YourSidebar = { args:{groups:[{label:'Commerce',items:[{id:'orders',label:'Orders'},{id:'products',label:'Products'}]},{label:'Account',items:[{id:'team',label:'Team Members'}]}],selected:'orders'}, render:args => <div className="ad-sidebar" style={{height:'100vh'}}><CollapsibleSidebar {...args}/></div> };
