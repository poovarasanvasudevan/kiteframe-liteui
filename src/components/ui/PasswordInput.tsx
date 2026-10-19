import type * as React from 'react';
import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { TextFieldProps } from './Fields';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type'> {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  showToggle?: boolean;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({
  label,
  hint,
  error,
  visible,
  defaultVisible = false,
  onVisibilityChange,
  showToggle = true,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  id,
  className = '',
  disabled,
  'aria-invalid': invalid,
  'aria-describedby': describedBy,
  ...inputProps
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;
  const [localVisible, setLocalVisible] = useState(defaultVisible);
  const isVisible = visible ?? localVisible;
  const isInvalid = !!error || invalid === true || invalid === 'true';
  const toggleVisibility = () => {
    const next = !isVisible;
    if (visible === undefined) setLocalVisible(next);
    onVisibilityChange?.(next);
  };

  return <div className={`ad-field ad-password-input ${className}`.trim()}>
    {label && <label htmlFor={inputId}>{label}</label>}
    <div className="ad-password-input-control" data-disabled={disabled || undefined} data-invalid={isInvalid || undefined}>
      <input {...inputProps} ref={ref} id={inputId} className="ad-password-input-entry" type={isVisible ? 'text' : 'password'} disabled={disabled} aria-invalid={error ? true : invalid} aria-describedby={[describedBy, hint || error ? messageId : null].filter(Boolean).join(' ') || undefined}/>
      {showToggle && <button type="button" className="ad-password-input-toggle" aria-label={isVisible ? hidePasswordLabel : showPasswordLabel} aria-pressed={isVisible} aria-controls={inputId} disabled={disabled} onMouseDown={event => event.preventDefault()} onClick={toggleVisibility}>{isVisible ? <EyeOff size={14} aria-hidden="true"/> : <Eye size={14} aria-hidden="true"/>}</button>}
    </div>
    {error ? <span id={messageId} className="ad-field-error">{error}</span> : hint && <span id={messageId} className="ad-hint">{hint}</span>}
  </div>;
});
