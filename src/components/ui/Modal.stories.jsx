import React, { useState } from 'react';
import { Button, CheckRow, Modal } from './index';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Use for focused administrator tasks. Escape and the backdrop close the dialog; focus returns to the opening control.' } } },
};
export default meta;

export const Playground = {
  render: args => <ModalDemo {...args}/>,
  args: { title: 'Configure directory', closeLabel: 'Close dialog' },
  parameters: { docs: { source: { code: `const [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>Configure directory</Button>\n<Modal title="Configure directory" open={open} onClose={() => setOpen(false)} footer={<Button variant="primary" onClick={() => setOpen(false)}>Done</Button>}>\n  <CheckRow defaultChecked>ADSELF</CheckRow>\n</Modal>` } } },
};
function ModalDemo(args) {
  const [open, setOpen] = useState(false);
  return <><Button onClick={() => setOpen(true)}>Configure directory</Button><Modal {...args} open={open} onClose={() => setOpen(false)} footer={<Button variant="primary" onClick={() => setOpen(false)}>Done</Button>}><CheckRow defaultChecked>ADSELF</CheckRow></Modal></>;
}
