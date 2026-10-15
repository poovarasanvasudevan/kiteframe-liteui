import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AppShell, CollapsibleSidebar, DashboardToolbar, ReportNavigation, ReportFilters, PolicyTable, ShortcutRail, Frame, DataTable } from './index';
import { DashboardPage, ReportsPage, ConfigurationPage } from '../pages';

test('shell and sidebar use caller supplied labels and actions', () => {
  const onSectionChange = jest.fn();
  const onSelect = jest.fn();
  render(<AppShell activeSection="Orders" onSectionChange={onSectionChange} headerProps={{brand:'Acme Console',sections:[{id:'orders',label:'Orders'},{id:'billing',label:'Billing'}],showBrandOrbit:false,showDownload:false,showNotifications:false,showUserMenu:false,showSettings:false,utilityItems:[],directories:[],searchPlaceholder:'Find customer'}} footerProps={{items:[{id:'help',label:'Help center'}],onItemSelect:onSelect}} sidebar={<CollapsibleSidebar groups={[{label:'Manage',items:[{id:'customers',label:'Customers'}]}]} selected="customers" onSelect={onSelect}/>}>Custom content</AppShell>);
  expect(screen.getByText('Acme Console')).toBeInTheDocument();
  expect(screen.queryByText('ADSelfService Plus')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Billing'}));
  expect(onSectionChange).toHaveBeenCalledWith('billing',expect.objectContaining({label:'Billing'}));
  fireEvent.click(screen.getByRole('button',{name:'Customers'}));
  expect(onSelect).toHaveBeenCalledWith('customers',expect.objectContaining({label:'Customers'}));
  fireEvent.click(screen.getByRole('button',{name:'Help center'}));
  expect(onSelect).toHaveBeenCalledWith('help',expect.objectContaining({label:'Help center'}));
});

test('dashboard accepts custom metrics, charts, domains and shortcuts', () => {
  const onReportSelect = jest.fn();
  const onShortcutSelect = jest.fn();
  const onDomainChange = jest.fn();
  render(<DashboardPage metrics={[{id:'sales',title:'Sales Today',value:'128',caption:'Orders',report:'sales-report',icon:null}]} directoryData={[{id:'open',label:'Open Orders',value:12}]} mfaData={[{id:'web',label:'Web',value:7,color:'#3366cc'},{id:'shop',label:'Shop',value:3,color:'#ff9900'}]} selfServiceData={[{id:'returns',label:'Returns',value:4}]} shortcuts={[{title:'Quick Links',links:[{id:'customers',label:'Customers'}]}]} domains={['Production','Staging']} toolbarProps={{domainLabel:'Environment'}} onDomainChange={onDomainChange} onReportSelect={onReportSelect} onShortcutSelect={onShortcutSelect} chartTitles={{directory:'Order Reports',mfa:'Channels',selfService:'Operations'}}/>);
  expect(screen.getByText('Sales Today')).toBeInTheDocument();
  expect(screen.getByText('Order Reports')).toBeInTheDocument();
  expect(screen.getByRole('button',{name:'Open Orders: 12 users'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:/Sales Today 128 Orders/}));
  expect(onReportSelect).toHaveBeenCalledWith('sales-report',expect.objectContaining({title:'Sales Today'}));
  fireEvent.click(screen.getByRole('button',{name:'Customers'}));
  expect(onShortcutSelect).toHaveBeenCalledWith('customers',expect.objectContaining({label:'Customers'}));
  fireEvent.change(screen.getByLabelText('Environment'),{target:{value:'Staging'}});
  expect(onDomainChange).toHaveBeenCalledWith('Staging',expect.anything());
});

test('reports use caller supplied groups, filters, labels and actions', () => {
  const groups = [{label:'Sales Reports',items:[{id:'revenue',label:'Revenue Report'}]}];
  const onGenerate = jest.fn();
  render(<ReportsPage groups={groups} selected="revenue" labels={{schedule:'Automate',empty:'No sales yet'}} filtersProps={{domains:['West','East'],defaultDomain:'West',ouOptions:['All Teams','Sales Team'],defaultOu:'All Teams',labels:{domain:'Region',selectOu:'Choose Team',generate:'Run Report',stop:'Cancel'}}} onGenerate={onGenerate}/>);
  expect(screen.getByRole('heading',{name:/Revenue Report/})).toBeInTheDocument();
  expect(screen.getByText('No sales yet')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Run Report'}));
  expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({selected:'revenue',report:expect.objectContaining({label:'Revenue Report'})}));
  expect(screen.getByLabelText('Region')).toHaveValue('West');
});

test('report navigation, filters, policy columns and configuration content can be replaced', () => {
  const onSelect = jest.fn();
  const {unmount} = render(<ReportNavigation groups={[{label:'Billing',items:[{id:'invoice',label:'Invoice Summary'}]}]} selected="invoice" onSelect={onSelect} searchPlaceholder="Find insight"/>);
  fireEvent.click(screen.getByRole('button',{name:'Invoice Summary'}));
  expect(onSelect).toHaveBeenCalledWith('invoice',expect.objectContaining({label:'Invoice Summary'}));
  unmount();
  const onDomainChange = jest.fn();
  const {unmount:unmountFilters} = render(<ReportFilters domains={[{value:'west',label:'West'},{value:'east',label:'East'}]} onDomainChange={onDomainChange} ouOptions={['All Teams','Support']} labels={{domain:'Region',selectOu:'Team',generate:'Run',stop:'Cancel'}}/>);
  fireEvent.change(screen.getByLabelText('Region'),{target:{value:'east'}});
  expect(onDomainChange).toHaveBeenCalledWith('east',expect.objectContaining({label:'East'}));
  fireEvent.click(screen.getByRole('button',{name:'Team'}));
  expect(screen.getByLabelText(/Support/)).toBeInTheDocument();
  unmountFilters();
  const {unmount:unmountTable} = render(<PolicyTable policies={[{id:'one',name:'Starter',domain:'West'}]} columns={[{key:'name',label:'Plan'},{key:'domain',label:'Region'}]}/>);
  expect(screen.getByRole('columnheader',{name:'Plan'})).toBeInTheDocument();
  expect(screen.getByText('West')).toBeInTheDocument();
  unmountTable();
  render(<ConfigurationPage selected="plans" groups={[{label:'Billing',items:[{id:'plans',label:'Plan Settings'}]}]} renderSection={() => <div>My own settings</div>}/>);
  expect(screen.getByRole('heading',{name:/Plan Settings/})).toBeInTheDocument();
  expect(screen.getByText('My own settings')).toBeInTheDocument();
});

test('standalone toolbar and shortcut rail expose their own data props', () => {
  const onSelect = jest.fn();
  render(<><DashboardToolbar domains={['A','B']} domainLabel="Workspace" menuItems={[{id:'refresh',label:'Sync now'}]}/><ShortcutRail groups={[{title:'Tools',links:[{id:'team',label:'Team Directory'}]}]} onSelect={onSelect}/></>);
  expect(screen.getByLabelText('Workspace')).toHaveValue('A');
  fireEvent.click(screen.getByRole('button',{name:'Team Directory'}));
  expect(onSelect).toHaveBeenCalledWith('team',expect.objectContaining({label:'Team Directory'}));
});

test('report page manages custom selection and passes selected filters to actions', () => {
  const onGenerate = jest.fn();
  render(<ReportsPage groups={[{label:'Sales',items:[{id:'daily',label:'Daily Sales'},{id:'weekly',label:'Weekly Sales'}]}]} filtersProps={{domains:['North','South'],ouOptions:['All OU','Retail']}} onGenerate={onGenerate}/>);
  fireEvent.click(screen.getByRole('button',{name:'Sales'}));
  fireEvent.click(screen.getByRole('button',{name:'Weekly Sales'}));
  fireEvent.change(screen.getByLabelText('Select Domain'),{target:{value:'South'}});
  fireEvent.click(screen.getByRole('button',{name:'Select OU'}));
  fireEvent.click(screen.getByLabelText('Retail'));
  fireEvent.click(screen.getByRole('button',{name:'Generate'}));
  expect(onGenerate).toHaveBeenCalledWith(expect.objectContaining({selected:'weekly',domain:'South',ou:'Retail'}));
  expect(screen.getByRole('heading',{name:/Weekly Sales/})).toBeInTheDocument();
});

test('configuration page paginates caller supplied policies and forwards feature actions', () => {
  const onFeatureSelect = jest.fn();
  render(<ConfigurationPage policyId="plans" groups={[{label:'Billing',items:[{id:'plans',label:'Plans'}]}]} initialPolicies={[{id:'one',name:'Starter'},{id:'two',name:'Growth'}]} columns={[{key:'name',label:'Plan'}]} features={[{id:'access',label:'Access'}]} onFeatureSelect={onFeatureSelect} toolbarProps={{pageSize:1}}/>);
  expect(screen.getByText('Starter')).toBeInTheDocument();
  expect(screen.queryByText('Growth')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Next page'}));
  expect(screen.getByText('Growth')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Access'}));
  expect(onFeatureSelect).toHaveBeenCalledWith('access',expect.objectContaining({label:'Access'}));
});

test('settings tabs and data tables accept labeled objects and row data', () => {
  const onRowClick = jest.fn();
  render(<><Frame title="Workspace" tabs={[{id:'general',label:'General'},{id:'billing',label:'Billing'}]}>{active => <p>{active} settings</p>}</Frame><DataTable columns={[{key:'name',label:'Customer'},{key:'revenue',label:'Revenue',render:row => `$${row.revenue}` }]} rows={[{id:'one',name:'Acme',revenue:120}]} onRowClick={onRowClick}/></>);
  fireEvent.click(screen.getByRole('tab',{name:'Billing'}));
  expect(screen.getByText('billing settings')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Acme'));
  expect(onRowClick).toHaveBeenCalledWith(expect.objectContaining({name:'Acme'}),0);
  expect(screen.getByText('$120')).toBeInTheDocument();
});
