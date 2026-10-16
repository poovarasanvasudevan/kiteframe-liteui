# @kiteapps/lite-ui

A React widget library and interactive reference implementation of the [ADSelfService Plus live demo](https://demo.adselfserviceplus.com/). It follows the reference's compact scale: a 69 px dark header, 244 px navigation rail, small form controls, flat panels, and green primary buttons. Icons use Lucide.

## Run

```bash
npm install
npm start
npm run storybook
npm run build
```

`npm run build` creates the distributable package in `dist`. `npm run build:demo` builds the standalone demo; `npm run build-storybook` builds the component catalog. The demo starts on Login Settings. Use the top navigation to open Dashboard, Reports, and Configuration.

## Package entries

The root entry exports every widget and page. Install the package and its peer dependencies in your React project:

```bash
npm install @kiteapps/lite-ui react react-dom lucide-react
```

```jsx
import '@kiteapps/lite-ui/styles.css';
import {
  AppShell, TopNavigation, CollapsibleSidebar, MetricWidget, MfaChart,
  ShortcutRail, ReportCategoryBar, ReportNavigation, PolicyTable,
  DashboardPage, ReportsPage, ConfigurationPage, AdminScreen,
} from '@kiteapps/lite-ui';
```

## Use your own content

The ADSelfService Plus text and counts are defaults for the demo. Pass your own labels, data, and callbacks to each widget or page:

```jsx
import { ShoppingCart } from 'lucide-react';
import '@kiteapps/lite-ui/styles.css';
import { AppShell, MetricWidget, ReportNavigation, PolicyTable, DashboardPage, ReportsPage } from '@kiteapps/lite-ui';

const metrics = [
  { id: 'orders', title: 'Orders Today', value: '128', caption: 'Across all stores', icon: ShoppingCart, report: 'daily' },
];
const reportGroups = [
  { label: 'Sales Reports', items: [{ id: 'daily', label: 'Daily Sales' }] },
];

<AppShell
  activeSection="Dashboard"
  hideSidebar
  mainClassName="ad-main--dashboard"
  headerProps={{
    brand: 'Acme Console', sections: ['Dashboard', 'Reports'],
    directories: ['Production', 'Staging'], showDownload: false,
    utilityItems: [], showNotifications: false, showBrandOrbit: false,
  }}
  footerProps={{ items: [{ id: 'help', label: 'Help Center', href: '/help' }] }}
>
  <DashboardPage
    metrics={metrics}
    directoryData={[{ id: 'open', label: 'Open Orders', value: 64 }]}
    mfaData={[{ id: 'web', label: 'Web', value: 70, color: '#3b82f6' }]}
    selfServiceData={[{ id: 'returns', label: 'Returns', value: 12 }]}
    shortcuts={[{ title: 'Store Tools', links: [{ id: 'inventory', label: 'Inventory' }] }]}
    chartTitles={{ directory: 'Order Status', mfa: 'Sales Channels', selfService: 'Operations' }}
    chartProps={{ directory: { max: 100, axisLabel: 'Orders' } }}
    domains={['Production', 'Staging']}
    onReportSelect={(reportId, item) => console.log(reportId, item)}
    onShortcutSelect={(id, item) => console.log(id, item)}
  />
</AppShell>
```

`ReportNavigation`, `ReportCategoryBar`, and `ReportsPage` accept `groups={reportGroups}`. `ReportsPage` also accepts `filtersProps` for domain and OU choices, `labels` for text, and `onGenerate`, `onStop`, and `onSchedule` for actions. It manages report selection internally unless you pass `selected` and `onSelect`. The `onGenerate` callback receives `{ selected, report, domain, ou }`.

`ConfigurationPage` accepts custom `groups`, `policies` or `initialPolicies`, `features`, `columns`, `labels`, `onFeatureSelect`, and policy action callbacks. It manages policies locally unless you pass `policies` and `onPoliciesChange`. The toolbar searches and paginates the displayed rows; set `toolbarProps.pageSize` to change page size. `PolicyTable` accepts custom columns such as `{ key: 'owner', label: 'Owner' }`, with values read from each policy object. `DataTable` likewise accepts object columns, object rows, custom cell renderers, and `onRowClick`.

Every page imports its building blocks from the public widget entry, and the Storybook **Widgets** and **Pages** stories show the same prop patterns interactively. To use one piece without a full page, render it directly, for example `<MetricWidget title="Orders" value="128" caption="Today" onClick={openOrders} />`.

`AdminScreen` is a reference page gallery. Pass `screens={{ myScreen: MySettingsPage }}` or `renderScreen={id => ...}` to supply your own page; build it from the exported form widgets such as `Frame`, `FormRow`, `CheckRow`, `InlineSelect`, `DataTable`, and `SaveBar`.

For local package installation, run `npm pack` and install the resulting `.tgz` in the consuming project. React, React DOM, and Lucide React are peer dependencies. The library builds ESM and CommonJS files, TypeScript declarations, and CSS. Import the stylesheet once in your app. The `/pages` import path remains available for existing consumers.

## Publish to npm

The package name in `package.json` is `@kiteapps/lite-ui`. Sign in with an npm account that owns or has publish access to the `@kiteapps` scope. Choose and add the package's license before public release.

```bash
npm login
npm whoami
npm test -- --watch=false
npm run build:lib
npm pack --dry-run
npm publish --access public
```

`prepack` also runs the library build when publishing. For a later release, update the version with `npm version patch` (or `minor`/`major`) before publishing again. See the [npm guide to scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/).

The Storybook catalog has only **Widgets** and **Pages**. Widgets contains editable, interactive stories for PageHeader, DashboardToolbar, report navigation and filters, ShellHeader, TopNavigation, ShellFooter, AppShell, collapsible and configuration sidebars, policy features and tables, settings tabs, and InlineSelect. Each story has **Controls** for text and data props and a **Last action** readout for callback behavior. PolicyTable includes custom-column and empty-state variations.

| Widget | Content props | Action props |
| --- | --- | --- |
| `PageHeader` | `title`, `help`, `action` (React node) | Pass a callback to the action node, for example `<Button onClick={addUser}>` |
| `DashboardToolbar` | `domains`, `domainLabel`, `menuItems` | `onDomainChange`, `onMenuAction`, `onToggleShortcuts`, `onExpand` |
| `ReportNavigation`, `ReportCategoryBar` | `groups`, `selected` or `defaultSelected` | `onSelect(id, item)` |
| `ReportFilters` | `domains`, `ouOptions`, `labels`, controlled `domain` and `ou` | `onDomainChange(value, item)`, `onOuChange(value, item)`, `onGenerate`, `onStop` |
| `ShellHeader`, `TopNavigation`, `ShellFooter` | `brand`, `sections`, `directories`, `items` and labels | `onSectionChange`, `onDirectoryChange`, `onItemSelect` and utility callbacks |
| `ConfigurationSidebar`, `PolicyFeatureStrip` | `groups`, `features`, `title`, `instruction` | `onSelect`, `onFeatureSelect` |
| `PolicyTable`, `DataTable` | Object rows, columns, custom cell renderers, empty messages | `onEdit`, `onDelete`, `onCopy`, `onRowClick` |
| `Frame`, `InlineSelect` | `tabs`, `title`, `options`, controlled or default values | `onTabChange`, `onChange` |

Forms and report filters keep state locally when controlled values are omitted. Save shows a local confirmation and does not connect to ADSelfService Plus.

## Reference coverage

The demo was inspected in its Administrator, Dashboard, Reports, and Configuration areas on October 14, 2026. Dashboard includes four summary cards, three report charts, the feature shortcut rail, and settings menu. Reports includes five category groups and their visible report names, searchable navigation, category menus, domain/OU filters, and result state. Configuration includes its collapsible navigation and Policy Configuration page with feature strip and policies table. Other Configuration selections currently show a generic settings panel. The displayed counts and policies are reference demo data. Some deeper tabs and configuration dialogs were unavailable in the demo; these examples use local interactions and representative content and should be checked against a working administrator installation before claiming pixel parity.
