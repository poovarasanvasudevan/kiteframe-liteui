import React from 'react';
import { ConfigurationHeader, ConfigurationSidebar, PolicyFeatureStrip, PolicyTable, PolicyToolbar } from './ConfigurationWidgets';

const meta = { title:'Widgets/Configuration', tags:['autodocs'], parameters:{layout:'fullscreen'} };
export default meta;
export const Sidebar = { render:() => <div className="ad-sidebar" style={{height:'100vh'}}><ConfigurationSidebar/></div> };
export const PageHeading = { render:() => <div style={{padding:'0 20px'}}><ConfigurationHeader title="Policy Configuration"/></div> };
export const FeatureStrip = { render:() => <div style={{padding:20}}><PolicyFeatureStrip/></div> };
export const TableToolbar = { render:() => <div style={{padding:20}}><PolicyToolbar count={7}/></div> };
export const PoliciesTable = { render:() => <div style={{padding:20}}><PolicyTable/></div> };
export const YourPolicyTable = { args:{policies:[{id:'starter',name:'Starter Plan',domain:'North',owner:'Alice'},{id:'team',name:'Team Plan',domain:'South',owner:'Bob'}],columns:[{key:'name',label:'Plan'},{key:'domain',label:'Region'},{key:'owner',label:'Owner'}]}, render:args => <div style={{padding:20}}><PolicyTable {...args}/></div> };
