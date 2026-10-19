import React, { useState } from 'react';
import { RadioRow } from './index';

const meta = {
  title: 'Components/RadioRow',
  component: RadioRow,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Native radio input styled for administrator forms. Use the same name for each option in a group.' } } },
};
export default meta;

export const Group = {
  render: () => <RadioGroupDemo/>,
  parameters: { docs: { source: { code: `function DeliveryOptions() {\n  const [value, setValue] = useState('SMTP');\n  return <>\n    <RadioRow name="delivery" value="SMTP" checked={value === 'SMTP'} onChange={setValue}>SMTP</RadioRow>\n    <RadioRow name="delivery" value="API" checked={value === 'API'} onChange={setValue}>API</RadioRow>\n  </>;\n}` } } },
};
function RadioGroupDemo() {
  const [value, setValue] = useState('SMTP');
  return <div className="story-column"><RadioRow name="delivery" value="SMTP" checked={value === 'SMTP'} onChange={setValue}>SMTP</RadioRow><RadioRow name="delivery" value="API" checked={value === 'API'} onChange={setValue}>API</RadioRow><p>Selected: {value}</p></div>;
}
export const Disabled = { render: () => <RadioRow name="mode" value="disabled" disabled>Unavailable option</RadioRow> };
