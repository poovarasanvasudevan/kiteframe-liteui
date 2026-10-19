import type * as React from 'react';
import { useState } from 'react';

export type TabItem = string | { id: string; label: string; disabled?: boolean };
export interface TabsProps {
  tabs?: TabItem[];
  active?: string;
  defaultActive?: string;
  onChange?: (id: string, item: { id: string; label: string; disabled?: boolean }) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({ tabs = [], active, defaultActive, onChange, ariaLabel = 'Tabs', className = '' }: TabsProps) {
  const items = tabs.map(raw => typeof raw === 'string' ? { id: raw, label: raw } : raw);
  const [local, setLocal] = useState(defaultActive ?? items[0]?.id);
  const selected = active === undefined ? local : active;
  const select = (item: typeof items[number]) => { if (active === undefined) setLocal(item.id); onChange?.(item.id, item); };
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    const enabled = items.filter(item => !item.disabled);
    if (!enabled.length) return;
    const current = enabled.findIndex(item => item.id === selected);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    event.preventDefault();
    const item = enabled[next];
    select(item);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons[items.findIndex(candidate => candidate.id === item.id)]?.focus();
  };
  return <div className={`ad-tabs ${className}`.trim()} role="tablist" aria-label={ariaLabel} onKeyDown={onKeyDown}>
    {items.map(tab => <button type="button" key={tab.id} className={`ad-tab ${tab.id === selected ? 'is-active' : ''}`} role="tab" aria-selected={tab.id === selected} tabIndex={tab.id === selected ? 0 : -1} disabled={tab.disabled} onClick={() => select(tab)}>{tab.label}</button>)}
  </div>;
}
