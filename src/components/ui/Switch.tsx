import type * as React from 'react';
import { forwardRef, useId } from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'onChange'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md';
  onChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  label,
  description,
  size = 'md',
  onChange,
  id,
  className = '',
  disabled,
  'aria-describedby': describedBy,
  'aria-labelledby': labelledBy,
  ...inputProps
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const labelId = `${inputId}-label`;
  const descriptionId = `${inputId}-description`;

  return <label className={`ad-switch ${disabled ? 'is-disabled' : ''} ${className}`.trim()} data-size={size}>
    <input
      {...inputProps}
      ref={ref}
      id={inputId}
      type="checkbox"
      role="switch"
      className="ad-switch-input"
      disabled={disabled}
      aria-labelledby={[label ? labelId : null, labelledBy].filter(Boolean).join(' ') || undefined}
      aria-describedby={[describedBy, description ? descriptionId : null].filter(Boolean).join(' ') || undefined}
      onChange={event => { if (!disabled) onChange?.(event.currentTarget.checked); }}
    />
    <span className="ad-switch-track" aria-hidden="true"><span className="ad-switch-thumb"/></span>
    {(label || description) && <span className="ad-switch-copy">
      {label && <span id={labelId} className="ad-switch-label">{label}</span>}
      {description && <span id={descriptionId} className="ad-switch-description">{description}</span>}
    </span>}
  </label>;
});
