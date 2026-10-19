import type * as React from 'react';
import { Info } from 'lucide-react';
import { Button } from './Button';
import { HelpTip } from './Choices';

export interface PageHeaderProps { title: React.ReactNode; action?: React.ReactNode; help?: string }
export function PageHeader({ title, action, help }: PageHeaderProps) {
  return <div className="ad-page-header"><h1>{title} {help && <HelpTip text={help}/>}</h1>{action && <div className="ad-header-action">{action}</div>}</div>;
}

export interface PanelProps extends React.HTMLAttributes<HTMLElement> {}
export function Panel({ children, className = '', ...props }: PanelProps) {
  return <section className={`ad-panel ${className}`.trim()} {...props}>{children}</section>;
}

export function SectionTitle({ children }: { children?: React.ReactNode }) { return <h2 className="ad-section-title">{children}</h2>; }

export interface FormRowProps {
  label: React.ReactNode;
  children?: React.ReactNode;
  required?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
  hintId?: string;
  errorId?: string;
  className?: string;
}
export function FormRow({ label, children, required = false, hint, error, htmlFor, hintId, errorId, className = '' }: FormRowProps) {
  const labelContent = <>{required && <b aria-hidden="true">* </b>}{label}</>;
  return <div className={`ad-form-row ${className}`.trim()} data-invalid={!!error || undefined}>
    {htmlFor ? <label className="ad-form-label" htmlFor={htmlFor}>{labelContent}</label> : <div className="ad-form-label">{labelContent}</div>}
    <div className="ad-form-control">
      {children}
      {error ? <div id={errorId} className="ad-field-error" role="alert">{error}</div> : hint && <div id={hintId} className="ad-hint">{hint}</div>}
    </div>
  </div>;
}

export interface ActionBarProps { onSave?: () => void; onCancel?: () => void; saveLabel?: string; cancelLabel?: string; status?: React.ReactNode; saving?: boolean }
export function ActionBar({ onSave, onCancel, saveLabel = 'Save', cancelLabel = 'Cancel', status, saving = false }: ActionBarProps) {
  return <div className="ad-action-bar"><Button variant="primary" onClick={onSave} disabled={saving}>{saving ? 'Saving…' : saveLabel}</Button>{onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}{status && <span className="ad-status" role="status">{status}</span>}</div>;
}

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> { tone?: 'info' | 'warning' | 'error' | 'success' | (string & {}) }
export function Notice({ children, tone = 'info', className = '', ...props }: NoticeProps) {
  return <div className={`ad-notice ad-notice--${tone} ${className}`.trim()} role={tone === 'error' ? 'alert' : 'status'} {...props}><Info size={15} aria-hidden="true"/><div>{children}</div></div>;
}
