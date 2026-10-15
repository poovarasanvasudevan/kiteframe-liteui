import React from 'react';
import { Frame, InlineSelect, SaveBar } from './SettingsWidgets';

const meta = { title:'Widgets/Settings', tags:['autodocs'], parameters:{layout:'padded'} };
export default meta;
export const SettingsFrame = { render:() => <Frame title="Login Settings" tabs={['General','Single Sign-On']}><p>Settings content</p></Frame> };
export const SaveActions = { render:() => <SaveBar/> };
export const InlineDropdown = { render:() => <InlineSelect options={['ADSELFSERVICE','Microsoft Entra ID']}/> };
