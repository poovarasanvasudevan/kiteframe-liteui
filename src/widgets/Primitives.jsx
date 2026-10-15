import React, { useId, useState } from 'react';
import { CircleHelp, Info, X } from 'lucide-react';

export function Button({ children, variant = 'neutral', icon: Icon, className = '', ...props }) {
  return <button className={`ad-button ad-button--${variant} ${className}`} {...props}>{Icon && <Icon size={13} strokeWidth={1.8} />}{children}</button>;
}
export function IconButton({ icon: Icon, label, ...props }) {
  return <button type="button" className="ad-icon-button" aria-label={label} title={label} {...props}><Icon size={15} strokeWidth={1.8}/></button>;
}
export function TextField({ label, hint, id, className = '', ...props }) {
  const generated = useId(); const inputId = id || generated;
  return <div className={`ad-field ${className}`}>{label && <label htmlFor={inputId}>{label}</label>}<input id={inputId} className="ad-input" {...props}/>{hint && <span className="ad-hint">{hint}</span>}</div>;
}
export function SelectField({ label, options = [], value, onChange, className = '', ...props }) {
  const id = useId(); return <div className={`ad-field ${className}`}>{label && <label htmlFor={id}>{label}</label>}<select id={id} className="ad-select" value={value} onChange={onChange} {...props}>{options.map(option => { const item = typeof option === 'string' ? { value: option, label: option } : option; return <option value={item.value} key={item.value}>{item.label}</option>; })}</select></div>;
}
export function CheckRow({ children, defaultChecked = false, checked, onChange, disabled = false, help, className = '' }) {
  const [local, setLocal] = useState(defaultChecked); const isChecked = checked === undefined ? local : checked;
  return <label className={`ad-check-row ${disabled ? 'is-disabled' : ''} ${className}`}><input type="checkbox" checked={isChecked} disabled={disabled} onChange={e => { setLocal(e.target.checked); onChange?.(e.target.checked); }}/><span className="ad-check-box" aria-hidden="true"/><span>{children}</span>{help && <HelpTip text={help}/>}</label>;
}
export function RadioRow({ name, value, checked, onChange, children, disabled }) {
  return <label className={`ad-radio-row ${disabled ? 'is-disabled' : ''}`}><input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange?.(value)}/><span className="ad-radio-mark" aria-hidden="true"/>{children}</label>;
}
export function HelpTip({ text }) { return <span className="ad-help" title={text} aria-label={text}><CircleHelp size={12}/></span>; }
export function TextLink({ children, onClick, ...props }) { return <button type="button" className="ad-text-link" onClick={onClick} {...props}>{children}</button>; }
export function Tabs({ tabs = [], active, onChange, ariaLabel = 'Tabs' }) { return <div className="ad-tabs" role="tablist" aria-label={ariaLabel}>{tabs.map(raw => {const tab = typeof raw === 'string' ? {id:raw,label:raw} : raw;return <button type="button" key={tab.id} className={`ad-tab ${tab.id === active ? 'is-active' : ''}`} role="tab" aria-selected={tab.id === active} onClick={() => onChange?.(tab.id,tab)}>{tab.label}</button>;})}</div>; }
export function PageHeader({ title, action, help }) { return <div className="ad-page-header"><h1>{title} {help && <HelpTip text={help}/>}</h1>{action && <div className="ad-header-action">{action}</div>}</div>; }
export function Panel({ children, className = '' }) { return <section className={`ad-panel ${className}`}>{children}</section>; }
export function SectionTitle({ children }) { return <h2 className="ad-section-title">{children}</h2>; }
export function FormRow({ label, children, required = false, hint }) { return <div className="ad-form-row"><div className="ad-form-label">{required && <b>* </b>}{label}</div><div className="ad-form-control">{children}{hint && <div className="ad-hint">{hint}</div>}</div></div>; }
export function ActionBar({ onSave, onCancel, saveLabel = 'Save', cancelLabel = 'Cancel', status }) { return <div className="ad-action-bar"><Button variant="primary" onClick={onSave}>{saveLabel}</Button>{onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}{status && <span className="ad-status" role="status">{status}</span>}</div>; }
export function Notice({ children, tone = 'info' }) { return <div className={`ad-notice ad-notice--${tone}`}><Info size={15}/><div>{children}</div></div>; }
export function DataTable({ columns = [], rows = [], empty = 'No Data Available', onRowClick, getRowId = (row, index) => row.id ?? index }) {
  return <div className="ad-table-wrap"><table className="ad-table"><thead><tr>{columns.map((raw, index) => {const column = typeof raw === 'string' ? {key:index,label:raw} : raw;return <th key={column.key ?? index}>{column.label}</th>;})}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={getRowId(row,index)} onClick={() => onRowClick?.(row,index)}>{columns.map((raw, columnIndex) => {const column = typeof raw === 'string' ? {key:columnIndex,label:raw} : raw;return <td key={column.key ?? columnIndex}>{column.render ? column.render(row,index) : Array.isArray(row) ? row[columnIndex] : row[column.key]}</td>;})}</tr>) : <tr><td className="ad-empty" colSpan={columns.length}>{empty}</td></tr>}</tbody></table></div>;
}
export function Modal({ title, children, open, onClose, footer, closeLabel = 'Close' }) { if (!open) return null; return <div className="ad-modal-backdrop" onMouseDown={onClose}><div className="ad-modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={e => e.stopPropagation()}><div className="ad-modal-head"><strong>{title}</strong><IconButton icon={X} label={closeLabel} onClick={onClose}/></div><div className="ad-modal-body">{children}</div>{footer && <div className="ad-modal-footer">{footer}</div>}</div></div>; }
