import React, { useState } from 'react';
import { DataTable } from './index';

const columns = [{ key: 'name', label: 'Policy' }, { key: 'domain', label: 'Directory' }, { key: 'users', label: 'Users' }];
const rows = [{ id: 'default', name: 'Default policy', domain: 'ADSELF', users: 204 }, { id: 'remote', name: 'Remote access', domain: 'ADSELF', users: 42 }];

const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Render object rows with column keys or render functions. Rows with onRowClick also respond to Enter and Space.' } } },
};
export default meta;

export const Playground = {
  args: { caption: 'Policies', columns, rows, empty: 'No policies found' },
  parameters: { docs: { source: { code: `<DataTable caption="Policies" columns={[{ key: 'name', label: 'Policy' }, { key: 'domain', label: 'Directory' }]} rows={[{ id: 'default', name: 'Default policy', domain: 'ADSELF' }]} empty="No policies found" />` } } },
};
export const InteractiveRows = {
  render: () => <SelectableTable/>,
  parameters: { docs: { source: { code: `<DataTable columns={[{ key: 'name', label: 'Policy' }]} rows={[{ id: 'default', name: 'Default policy' }]} onRowClick={(policy) => console.log(policy.name)} />` } } },
};
function SelectableTable() {
  const [selected, setSelected] = useState('');
  return <><DataTable columns={columns} rows={rows} onRowClick={row => setSelected(row.name)}/><p role="status">{selected ? `Selected: ${selected}` : 'Select a row'}</p></>;
}
export const Empty = { args: { columns, rows: [], empty: 'No policies match your search' } };
