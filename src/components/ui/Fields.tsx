import type * as React from 'react';
import { forwardRef, useId, useState } from 'react';
import { CircleHelp } from 'lucide-react';

function FieldLabel({ id, label, helpText, helpOpen, onToggle }: { id: string; label?: string; helpText?: React.ReactNode; helpOpen: boolean; onToggle: () => void }) {
  if (!helpText) return label ? <label htmlFor={id}>{label}</label> : null;
  return <>
    <div className="ad-field-label-row">
      {label && <label htmlFor={id}>{label}</label>}
      <button type="button" className="ad-field-help-toggle" aria-label={label ? `Help for ${label}` : 'Field help'} aria-expanded={helpOpen} aria-controls={`${id}-help`} onClick={onToggle}>
        <CircleHelp size={14} strokeWidth={1.8} aria-hidden="true"/>
      </button>
    </div>
    <div id={`${id}-help`} className="ad-field-help-text" hidden={!helpOpen}>{helpText}</div>
  </>;
}

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  helpText?: React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField({ label, hint, error, helpText, id, className = '', 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const [helpOpen, setHelpOpen] = useState(false);
  return <div className={`ad-field ${className}`.trim()}>
    <FieldLabel id={inputId} label={label} helpText={helpText} helpOpen={helpOpen} onToggle={() => setHelpOpen(open => !open)}/>
    <input ref={ref} id={inputId} className="ad-input" aria-invalid={error ? true : undefined} aria-describedby={[describedBy, hint || error ? messageId : null, helpText && helpOpen ? `${inputId}-help` : null].filter(Boolean).join(' ') || undefined} {...props}/>
    {error ? <span id={messageId} className="ad-field-error">{error}</span> : hint && <span id={messageId} className="ad-hint">{hint}</span>}
  </div>;
});

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  helpText?: React.ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ label, hint, error, helpText, id, className = '', rows = 4, 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const [helpOpen, setHelpOpen] = useState(false);
  return <div className={`ad-field ${className}`.trim()}>
    <FieldLabel id={inputId} label={label} helpText={helpText} helpOpen={helpOpen} onToggle={() => setHelpOpen(open => !open)}/>
    <textarea ref={ref} id={inputId} rows={rows} className="ad-textarea-field" aria-invalid={error ? true : undefined} aria-describedby={[describedBy, hint || error ? messageId : null, helpText && helpOpen ? `${inputId}-help` : null].filter(Boolean).join(' ') || undefined} {...props}/>
    {error ? <span id={messageId} className="ad-field-error">{error}</span> : hint && <span id={messageId} className="ad-hint">{hint}</span>}
  </div>;
});

export type SelectOption = string | { value: string; label: string };
export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  helpText?: React.ReactNode;
  options?: SelectOption[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField({ label, hint, error, helpText, options = [], id, className = '', 'aria-describedby': describedBy, ...props }, ref) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const messageId = `${selectId}-message`;
  const [helpOpen, setHelpOpen] = useState(false);
  return <div className={`ad-field ${className}`.trim()}>
    <FieldLabel id={selectId} label={label} helpText={helpText} helpOpen={helpOpen} onToggle={() => setHelpOpen(open => !open)}/>
    <select ref={ref} id={selectId} className="ad-select" aria-invalid={error ? true : undefined} aria-describedby={[describedBy, hint || error ? messageId : null, helpText && helpOpen ? `${selectId}-help` : null].filter(Boolean).join(' ') || undefined} {...props}>
      {options.map(option => { const item = typeof option === 'string' ? { value: option, label: option } : option; return <option value={item.value} key={item.value}>{item.label}</option>; })}
    </select>
    {error ? <span id={messageId} className="ad-field-error">{error}</span> : hint && <span id={messageId} className="ad-hint">{hint}</span>}
  </div>;
});
