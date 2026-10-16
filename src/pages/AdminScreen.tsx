import type * as React from 'react';
import { ADMIN_GROUPS as DEFAULT_GROUPS, AdminScreen as DemoAdminScreen } from '../admin/screens';
import type { NavigationGroup } from '../widgets';

export const ADMIN_GROUPS = DEFAULT_GROUPS as NavigationGroup[];
export interface AdminScreenProps {
  screen: string;
  screens?: Record<string, React.ComponentType<any>>;
  renderScreen?: (screen: string) => React.ReactNode;
  screenProps?: Record<string, unknown>;
}
export function AdminScreen(props: AdminScreenProps) {
  const Component = DemoAdminScreen as React.ComponentType<AdminScreenProps>;
  return <Component {...props}/>;
}
