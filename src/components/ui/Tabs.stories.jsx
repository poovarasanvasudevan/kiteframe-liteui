import React, { useState } from 'react';
import { Tabs } from './index';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'A compact tab list. Use active and onChange for controlled tabs, or defaultActive for local selection. Arrow keys, Home, and End move between tabs.' } } },
};
export default meta;

export const Playground = {
  args: { tabs: ['General', 'Single sign-on', 'Smart card'], defaultActive: 'General', ariaLabel: 'Login settings' },
  parameters: { docs: { source: { code: `<Tabs tabs={['General', 'Single sign-on', 'Smart card']} defaultActive="General" ariaLabel="Login settings" />` } } },
};
export const Controlled = {
  render: () => <ControlledTabs/>,
  parameters: { docs: { source: { code: `const [active, setActive] = useState('General');\n<Tabs tabs={['General', 'Security']} active={active} onChange={setActive} />` } } },
};
function ControlledTabs() {
  const [active, setActive] = useState('General');
  return <div style={{ padding: '0 14px' }}><Tabs tabs={['General', 'Security']} active={active} onChange={setActive}/><p>{active} settings</p></div>;
}
