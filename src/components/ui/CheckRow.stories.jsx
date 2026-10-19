import React, { useState } from 'react';
import { CheckRow } from './index';

const meta = {
  title: 'Components/CheckRow',
  component: CheckRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Native checkbox and radio controls with the compact administrator styling. Both support keyboard input and disabled state.' } } },
};
export default meta;

export const Checkbox = {
  args: { children: 'Enable password reset', defaultChecked: true, help: 'Users can reset their own password' },
  parameters: { docs: { source: { code: `<CheckRow defaultChecked help="Users can reset their own password">Enable password reset</CheckRow>` } } },
};
export const ControlledCheckbox = {
  render: () => <ControlledCheckboxDemo/>,
  parameters: { docs: { source: { code: `const [checked, setChecked] = useState(false);\n<CheckRow checked={checked} onChange={setChecked}>Require approval</CheckRow>` } } },
};
function ControlledCheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return <div className="story-column"><CheckRow checked={checked} onChange={setChecked}>Require approval</CheckRow><p>Approval is {checked ? 'required' : 'optional'}</p></div>;
}
