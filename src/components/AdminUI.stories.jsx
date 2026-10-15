import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { ActionBar, Button, CheckRow, DataTable, FormRow, HelpTip, IconButton, Modal, Notice, PageHeader, Panel, RadioRow, SectionTitle, SelectField, Tabs, TextField, TextLink } from './AdminUI';

const meta = { title: 'Widgets/Primitives', tags: ['autodocs'], parameters: { layout: 'padded' } };
export default meta;
export const Buttons = { render: () => <div className="story-row"><Button variant="primary">Save</Button><Button>Cancel</Button><Button variant="outline" icon={Plus}>Add Server</Button><Button disabled>Disabled</Button></div> };
export const IconButtons = { render: () => <IconButton icon={Search} label="Search"/> };
export const TextFields = { render: () => <div className="story-column"><TextField label="Server Name or IP" placeholder="server.example.com"/><TextField label="Port" defaultValue="443" hint="HTTPS port"/><TextField label="Disabled" disabled defaultValue="8888"/></div> };
export const SelectFields = { render: () => <SelectField label="Backup Frequency" options={['Daily','Weekly','Monthly']}/> };
export const CheckRows = { render: () => <div className="story-column"><CheckRow>Hide self-service admin login</CheckRow><CheckRow defaultChecked>Show the directory selection drop-down menu</CheckRow><CheckRow disabled>Unavailable option</CheckRow></div> };
export const RadioRows = { render: () => <RadioExample/> };
function RadioExample(){const [value,setValue]=useState('SMTP');return <div className="story-column"><RadioRow name="mode" value="SMTP" checked={value==='SMTP'} onChange={setValue}>SMTP</RadioRow><RadioRow name="mode" value="API" checked={value==='API'} onChange={setValue}>API</RadioRow></div>}
export const HelpTips = { render: () => <>Login Settings <HelpTip text="Configure portal login behavior"/></> };
export const TextLinks = { render: () => <TextLink onClick={()=>{}}>Configure Directory List</TextLink> };
export const TabBars = { render: () => <TabExample/> };
function TabExample(){const [active,setActive]=useState('General');return <div style={{width:580,padding:'0 14px'}}><Tabs tabs={['General','Single Sign-On','Smart Card Authentication']} active={active} onChange={setActive}/><p>Selected: {active}</p></div>}
export const PageHeaders = { render: () => <PageHeader title="Login Settings" help="Login settings help" action={<Button>Manage Custom Attributes</Button>}/> };
export const Panels = { render: () => <Panel><SectionTitle>Login Settings</SectionTitle><p>Panel content</p></Panel> };
export const SectionTitles = { render: () => <SectionTitle>CAPTCHA settings</SectionTitle> };
export const FormRows = { render: () => <div className="story-column"><FormRow label="Server Name or IP"><TextField placeholder="mail.example.com"/></FormRow><FormRow label="Backup Storage Path" required hint="Enter a local or network path"><TextField/></FormRow></div> };
export const ActionBars = { render: () => <ActionBar onSave={()=>{}} onCancel={()=>{}}/> };
export const Notices = { render: () => <div className="story-column"><Notice>Changes will reflect only on restart.</Notice><Notice tone="warning">Restart the service to apply connection changes.</Notice></div> };
export const DataTables = { render: () => <DataTable columns={['Server Name','IP Address','Status']} rows={[["Primary","192.168.1.10","Running"],["Secondary","192.168.1.11","Standby"]]}/> };
export const EmptyTables = { render: () => <DataTable columns={['User Name','Domain','Action']}/> };
export const Modals = { render: () => <ModalExample/> };
function ModalExample(){const [open,setOpen]=useState(false);return <><Button onClick={()=>setOpen(true)}>Configure Directory List</Button><Modal title="Configure Directory List" open={open} onClose={()=>setOpen(false)} footer={<Button variant="primary" onClick={()=>setOpen(false)}>Done</Button>}><CheckRow defaultChecked>ADSELFSERVICE</CheckRow></Modal></>}
