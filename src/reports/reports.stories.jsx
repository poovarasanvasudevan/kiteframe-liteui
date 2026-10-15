import React from 'react';
import { ReportCategoryBar, ReportFilters, ReportNavigation, ReportResults, ReportPageHeading } from '../widgets/ReportWidgets';

const meta = { title:'Widgets/Reports', tags:['autodocs'], parameters:{layout:'fullscreen'} };
export default meta;
export const ReportTitleAndSchedule = { render:() => <ReportPageHeading title="Locked Out Users Report"/> };
export const SearchableReportNavigation = { render:() => <div className="ad-sidebar" style={{height:'100vh'}}><ReportNavigation/></div> };
export const CategoryMenus = { render:() => <ReportCategoryBar selected="2"/> };
export const DomainAndOuFilters = { render:() => <ReportFilters/> };
export const EmptyReportResults = { render:() => <div style={{padding:20}}><ReportResults/></div> };
export const YourReportMenu = { args:{groups:[{label:'Sales Reports',items:[{id:'daily',label:'Daily Sales'},{id:'monthly',label:'Monthly Sales'}]}],selected:'daily',searchPlaceholder:'Find a report'}, render:args => <div className="ad-sidebar" style={{height:'100vh'}}><ReportNavigation {...args}/></div> };
export const YourFilters = { args:{domains:['North','South'],ouOptions:['All Teams','Retail'],labels:{domain:'Region',selectOu:'Team',generate:'Run',stop:'Cancel'}}, render:args => <ReportFilters {...args}/> };
