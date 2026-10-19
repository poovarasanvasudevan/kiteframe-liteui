import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button, IconButton, TextLink } from './index';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Compact actions for administrator forms and toolbars. Buttons default to type="button", so they are safe inside forms.' } } },
  argTypes: { variant: { control: 'select', options: ['neutral', 'primary', 'outline', 'download'] }, onClick: { action: 'clicked' }, icon: { control: false } },
};
export default meta;

export const Playground = {
  args: { children: 'Save changes', variant: 'primary' },
  parameters: { docs: { source: { code: `<Button variant="primary" onClick={() => console.log('Saved')}>Save changes</Button>` } } },
};
export const Variants = {
  render: () => <div className="story-row"><Button variant="primary">Save</Button><Button>Cancel</Button><Button variant="outline" icon={Plus}>Add policy</Button><Button disabled>Unavailable</Button></div>,
  parameters: { docs: { source: { code: `<Button variant="primary">Save</Button>\n<Button>Cancel</Button>\n<Button variant="outline" icon={Plus}>Add policy</Button>\n<Button disabled>Unavailable</Button>` } } },
};
export const IconAction = {
  render: () => <IconButton icon={Search} label="Search policies" onClick={() => {}}/>,
  parameters: { docs: { source: { code: `<IconButton icon={Search} label="Search policies" onClick={() => console.log('Search')} />` } } },
};
export const InlineAction = {
  render: () => <TextLink onClick={() => {}}>Configure directory</TextLink>,
  parameters: { docs: { source: { code: `<TextLink onClick={() => console.log('Open directory')}>Configure directory</TextLink>` } } },
};
