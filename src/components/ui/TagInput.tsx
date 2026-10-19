import type * as React from 'react';
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface TagInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'size'> {
  label?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  maxTags?: number;
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
  removeLabel?: (tag: string) => string;
}

export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput({
  label,
  hint,
  error,
  value,
  defaultValue = [],
  onChange,
  maxTags,
  allowDuplicates = false,
  addOnBlur = false,
  removeLabel = tag => `Remove ${tag}`,
  disabled,
  readOnly,
  required,
  name,
  id,
  className = '',
  placeholder = 'Add a tag',
  onKeyDown,
  onPaste,
  onBlur,
  'aria-invalid': invalid,
  'aria-describedby': describedBy,
  ...inputProps
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  const focusAfterRemove = useRef(false);
  const [localTags, setLocalTags] = useState(defaultValue);
  const [draft, setDraft] = useState('');
  const tags = value ?? localTags;
  const atLimit = maxTags !== undefined && tags.length >= maxTags;
  const isInvalid = !!error || invalid === true || invalid === 'true';

  useEffect(() => {
    if (focusAfterRemove.current && !disabled && !atLimit) {
      inputRef.current?.focus();
      focusAfterRemove.current = false;
    }
  }, [tags.length, disabled, atLimit]);

  const updateTags = (next: string[]) => {
    if (value === undefined) setLocalTags(next);
    onChange?.(next);
  };

  const addTags = (candidates: string[]) => {
    if (disabled || readOnly) return;
    const next = [...tags];
    for (const candidate of candidates) {
      const tag = candidate.trim();
      if (!tag || (maxTags !== undefined && next.length >= maxTags)) continue;
      if (!allowDuplicates && next.some(existing => existing.toLocaleLowerCase() === tag.toLocaleLowerCase())) continue;
      next.push(tag);
    }
    if (next.length !== tags.length) updateTags(next);
  };

  const removeTag = (index: number) => {
    if (disabled || readOnly) return;
    focusAfterRemove.current = true;
    updateTags(tags.filter((_, tagIndex) => tagIndex !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || readOnly) return;
    if (event.key === ',' || (event.key === 'Enter' && draft.length > 0)) {
      event.preventDefault();
      addTags(draft.split(','));
      setDraft('');
    } else if (event.key === 'Backspace' && !draft && tags.length) {
      event.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);
    if (event.defaultPrevented || disabled || readOnly) return;
    const text = event.clipboardData.getData('text');
    if (!/[,\r\n]/.test(text)) return;
    event.preventDefault();
    addTags(`${draft}${text}`.split(/[,\r\n]+/));
    setDraft('');
  };

  return <div className={`ad-field ad-tag-input ${className}`.trim()}>
    {label && <label htmlFor={inputId}>{label}</label>}
    <div className="ad-tag-input-control" data-disabled={disabled || undefined} data-invalid={isInvalid || undefined} onClick={() => inputRef.current?.focus()}>
      {tags.map((tag, index) => <span className="ad-tag-input-tag" key={`${tag}-${index}`}>
        <span>{tag}</span>
        <button type="button" className="ad-tag-input-remove" aria-label={removeLabel(tag)} disabled={disabled || readOnly} onClick={() => removeTag(index)}><X size={12} aria-hidden="true" /></button>
      </span>)}
      <input {...inputProps} ref={inputRef} id={inputId} type="text" className="ad-tag-input-entry" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={handleKeyDown} onPaste={handlePaste} onBlur={event => { if (addOnBlur && draft.trim()) { addTags(draft.split(',')); setDraft(''); } onBlur?.(event); }} disabled={disabled || atLimit} readOnly={readOnly} required={required && tags.length === 0} placeholder={atLimit ? '' : placeholder} aria-invalid={error ? true : invalid} aria-describedby={[describedBy, hint || error ? messageId : null].filter(Boolean).join(' ') || undefined}/>
    </div>
    {name && tags.map((tag, index) => <input key={`${tag}-${index}`} type="hidden" name={name} value={tag} />)}
    {error ? <span id={messageId} className="ad-field-error">{error}</span> : hint && <span id={messageId} className="ad-hint">{hint}</span>}
  </div>;
});
