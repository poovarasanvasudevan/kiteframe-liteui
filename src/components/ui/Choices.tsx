import type * as React from 'react';
import { useState } from 'react';
import { CircleHelp } from 'lucide-react';

export function HelpTip({ text }: { text: string }) {
  return <span className="ad-help" title={text} aria-label={text}><CircleHelp size={12} aria-hidden="true"/></span>;
}

export interface CheckRowProps {
  children?: React.ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  help?: string;
  className?: string;
  name?: string;
  value?: string;
}

export function CheckRow({ children, defaultChecked = false, checked, onChange, disabled = false, help, className = '', name, value }: CheckRowProps) {
  const [local, setLocal] = useState(defaultChecked);
  const isChecked = checked === undefined ? local : checked;
  return <label className={`ad-check-row ${disabled ? 'is-disabled' : ''} ${className}`.trim()}>
    <input type="checkbox" name={name} value={value} checked={isChecked} disabled={disabled} onChange={event => { if (checked === undefined) setLocal(event.target.checked); onChange?.(event.target.checked); }}/>
    <span className="ad-check-box" aria-hidden="true"/><span>{children}</span>{help && <HelpTip text={help}/>}
  </label>;
}

export interface RadioRowProps {
  name: string;
  value: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RadioRow({ name, value, checked, defaultChecked, onChange, children, disabled, className = '' }: RadioRowProps) {
  return <label className={`ad-radio-row ${disabled ? 'is-disabled' : ''} ${className}`.trim()}>
    <input type="radio" name={name} value={value} checked={checked} defaultChecked={checked === undefined ? defaultChecked : undefined} disabled={disabled} onChange={() => onChange?.(value)}/>
    <span className="ad-radio-mark" aria-hidden="true"/>{children}
  </label>;
}
