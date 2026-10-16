import type * as React from 'react';
import { useId, useState } from 'react';
import { CircleHelp, Info, X, type LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neutral' | 'primary' | 'outline' | 'download' | (string & {});
  icon?: LucideIcon;
}
export function Button({ children, variant = 'neutral', icon: Icon, className = '', ...props }: ButtonProps) {
  return <button className={`ad-button ad-button--${variant} ${className}`} {...props}>{Icon && <Icon size={13} strokeWidth={1.8}/>} {children}</button>;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
}
export function IconButton({ icon: Icon, label, ...props }: IconButtonProps) {
  return <button type="button" className="ad-icon-button" aria-label={label} title={label} {...props}><Icon size={15} strokeWidth={1.8}/></button>;
}

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: React.ReactNode;
}
export function TextField({ label, hint, id, className = '', ...props }: TextFieldProps) {
  const generated = useId();
  const inputId = id || generated;
  return <div className={`ad-field ${className}`}>{label && <label htmlFor={inputId}>{label}</label>}<input id={inputId} className="ad-input" {...props}/>{hint && <span className="ad-hint">{hint}</span>}</div>;
}

export type SelectOption = string | { value: string; label: string };
export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
}
export function SelectField({ label, options = [], value, onChange, className = '', ...props }: SelectFieldProps) {
  const id = useId();
  return <div className={`ad-field ${className}`}>{label && <label htmlFor={id}>{label}</label>}<select id={id} className="ad-select" value={value} onChange={onChange} {...props}>{options.map(option => { const item = typeof option === 'string' ? { value: option, label: option } : option; return <option value={item.value} key={item.value}>{item.label}</option>; })}</select></div>;
}

export interface CheckRowProps {
  children?: React.ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  help?: string;
  className?: string;
}
export function CheckRow({ children, defaultChecked = false, checked, onChange, disabled = false, help, className = '' }: CheckRowProps) {
  const [local, setLocal] = useState(defaultChecked);
  const isChecked = checked === undefined ? local : checked;
  return <label className={`ad-check-row ${disabled ? 'is-disabled' : ''} ${className}`}><input type="checkbox" checked={isChecked} disabled={disabled} onChange={event => { if (checked === undefined) setLocal(event.target.checked); onChange?.(event.target.checked); }}/><span className="ad-check-box" aria-hidden="true"/><span>{children}</span>{help && <HelpTip text={help}/>}</label>;
}

export interface RadioRowProps {
  name: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
}
export function RadioRow({ name, value, checked, onChange, children, disabled }: RadioRowProps) {
  return <label className={`ad-radio-row ${disabled ? 'is-disabled' : ''}`}><input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange?.(value)}/><span className="ad-radio-mark" aria-hidden="true"/>{children}</label>;
}

export function HelpTip({ text }: { text: string }) { return <span className="ad-help" title={text} aria-label={text}><CircleHelp size={12}/></span>; }
export interface TextLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export function TextLink({ children, onClick, ...props }: TextLinkProps) { return <button type="button" className="ad-text-link" onClick={onClick} {...props}>{children}</button>; }

export type TabItem = string | { id: string; label: string };
export interface TabsProps {
  tabs?: TabItem[];
  active?: string;
  onChange?: (id: string, item: { id: string; label: string }) => void;
  ariaLabel?: string;
}
export function Tabs({ tabs = [], active, onChange, ariaLabel = 'Tabs' }: TabsProps) {
  return <div className="ad-tabs" role="tablist" aria-label={ariaLabel}>{tabs.map(raw => { const tab = typeof raw === 'string' ? { id: raw, label: raw } : raw; return <button type="button" key={tab.id} className={`ad-tab ${tab.id === active ? 'is-active' : ''}`} role="tab" aria-selected={tab.id === active} onClick={() => onChange?.(tab.id, tab)}>{tab.label}</button>; })}</div>;
}

export interface PageHeaderProps { title: React.ReactNode; action?: React.ReactNode; help?: string }
export function PageHeader({ title, action, help }: PageHeaderProps) { return <div className="ad-page-header"><h1>{title} {help && <HelpTip text={help}/>}</h1>{action && <div className="ad-header-action">{action}</div>}</div>; }
export function Panel({ children, className = '' }: { children?: React.ReactNode; className?: string }) { return <section className={`ad-panel ${className}`}>{children}</section>; }
export function SectionTitle({ children }: { children?: React.ReactNode }) { return <h2 className="ad-section-title">{children}</h2>; }
export function FormRow({ label, children, required = false, hint }: { label: React.ReactNode; children?: React.ReactNode; required?: boolean; hint?: React.ReactNode }) { return <div className="ad-form-row"><div className="ad-form-label">{required && <b>* </b>}{label}</div><div className="ad-form-control">{children}{hint && <div className="ad-hint">{hint}</div>}</div></div>; }
export interface ActionBarProps { onSave?: () => void; onCancel?: () => void; saveLabel?: string; cancelLabel?: string; status?: React.ReactNode }
export function ActionBar({ onSave, onCancel, saveLabel = 'Save', cancelLabel = 'Cancel', status }: ActionBarProps) { return <div className="ad-action-bar"><Button variant="primary" onClick={onSave}>{saveLabel}</Button>{onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}{status && <span className="ad-status" role="status">{status}</span>}</div>; }
export function Notice({ children, tone = 'info' }: { children?: React.ReactNode; tone?: 'info' | 'warning' | 'error' | (string & {}) }) { return <div className={`ad-notice ad-notice--${tone}`}><Info size={15}/><div>{children}</div></div>; }

export type DataRow = Record<string, any> | React.ReactNode[];
export type DataColumn<Row extends DataRow = DataRow> = string | { key: string; label: string; render?: (row: Row, index: number) => React.ReactNode };
export interface DataTableProps<Row extends DataRow = DataRow> {
  columns?: DataColumn<Row>[];
  rows?: Row[];
  empty?: React.ReactNode;
  onRowClick?: (row: Row, index: number) => void;
  getRowId?: (row: Row, index: number) => React.Key;
}
export function DataTable<Row extends DataRow = DataRow>({ columns = [], rows = [], empty = 'No Data Available', onRowClick, getRowId = (row, index) => !Array.isArray(row) && row.id != null ? String(row.id) : index }: DataTableProps<Row>) {
  return <div className="ad-table-wrap"><table className="ad-table"><thead><tr>{columns.map((raw, index) => { const column = typeof raw === 'string' ? { key: String(index), label: raw } : raw; return <th key={column.key}>{column.label}</th>; })}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={getRowId(row,index)} onClick={() => onRowClick?.(row,index)}>{columns.map((raw, columnIndex) => { const column = typeof raw === 'string' ? { key: String(columnIndex), label: raw } : raw; const value = 'render' in column && column.render ? column.render(row,index) : Array.isArray(row) ? row[columnIndex] : row[column.key]; return <td key={column.key}>{value as React.ReactNode}</td>; })}</tr>) : <tr><td className="ad-empty" colSpan={columns.length}>{empty}</td></tr>}</tbody></table></div>;
}

export interface ModalProps { title: string; children?: React.ReactNode; open?: boolean; onClose?: () => void; footer?: React.ReactNode; closeLabel?: string }
export function Modal({ title, children, open, onClose, footer, closeLabel = 'Close' }: ModalProps) { if (!open) return null; return <div className="ad-modal-backdrop" onMouseDown={onClose}><div className="ad-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}><div className="ad-modal-head"><strong>{title}</strong><IconButton icon={X} label={closeLabel} onClick={onClose}/></div><div className="ad-modal-body">{children}</div>{footer && <div className="ad-modal-footer">{footer}</div>}</div></div>; }
