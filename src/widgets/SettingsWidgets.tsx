import type * as React from 'react';
import { useState } from 'react';
import { ActionBar, PageHeader, Panel, Tabs, type SelectOption, type TabItem } from './Primitives';

export interface FrameProps {
  title: string;
  tabs?: TabItem[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  children?: React.ReactNode | ((active: string | undefined) => React.ReactNode);
  action?: React.ReactNode;
  help?: string;
  className?: string;
}
export function Frame({ title, tabs, activeTab, defaultTab, onTabChange, children, action, help, className = '' }: FrameProps) {
  const [localTab, setLocalTab] = useState(defaultTab ?? (typeof tabs?.[0] === 'string' ? tabs[0] : tabs?.[0]?.id));
  const active = activeTab ?? localTab;
  return <><PageHeader title={title} action={action} help={help}/><Panel className={className}>{tabs && <Tabs tabs={tabs} active={active} onChange={tab => { if (activeTab === undefined) setLocalTab(tab); onTabChange?.(tab); }}/>} {typeof children === 'function' ? children(active) : children}</Panel></>;
}

export interface SaveBarProps {
  saveLabel?: string;
  cancel?: boolean;
  cancelLabel?: string;
  successMessage?: string;
  onSave?: () => void;
  onCancel?: () => void;
  status?: string;
}
export function SaveBar({ saveLabel = 'Save', cancel = true, cancelLabel = 'Cancel', successMessage = 'Settings saved in this demo.', onSave, onCancel, status: controlledStatus }: SaveBarProps) {
  const [status, setStatus] = useState('');
  return <ActionBar saveLabel={saveLabel} cancelLabel={cancelLabel} onSave={() => { onSave?.(); if (controlledStatus === undefined) { setStatus(successMessage); window.setTimeout(() => setStatus(''), 4000); } }} onCancel={cancel ? () => { onCancel?.(); if (controlledStatus === undefined) setStatus(''); } : undefined} status={controlledStatus ?? status}/>;
}

export interface InlineSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  options?: SelectOption[];
  initial?: string;
  value?: string;
  onChange?: (value: string) => void;
  width?: React.CSSProperties['width'];
}
export function InlineSelect({ options = [], initial, value, onChange, width, ...props }: InlineSelectProps) {
  const [localValue, setLocalValue] = useState(initial ?? (typeof options[0] === 'string' ? options[0] : options[0]?.value));
  return <select className="ad-select" style={{width}} value={value ?? localValue} onChange={event => { if (value === undefined) setLocalValue(event.target.value); onChange?.(event.target.value); }} {...props}>{options.map(raw => { const item = typeof raw === 'string' ? {value:raw,label:raw} : raw; return <option key={item.value} value={item.value}>{item.label}</option>; })}</select>;
}
