import { useId, useState } from 'react';

export type ButtonGroupOption = string | { value: string; label: string; disabled?: boolean };

export interface ButtonGroupProps {
  options: ButtonGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: { value: string; label: string; disabled?: boolean }) => void;
  name?: string;
  ariaLabel?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

/** A mutually exclusive choice rendered as connected buttons. */
export function ButtonGroup({
  options,
  value,
  defaultValue,
  onChange,
  name,
  ariaLabel = 'Options',
  disabled = false,
  required = false,
  className = '',
}: ButtonGroupProps) {
  const generatedName = useId();
  const items = options.map(option => typeof option === 'string' ? { value: option, label: option } : option);
  const [localValue, setLocalValue] = useState(() => defaultValue ?? items.find(item => !item.disabled)?.value);
  const selected = value === undefined ? localValue : value;

  return <div className={`ad-button-group ${className}`.trim()} role="radiogroup" aria-label={ariaLabel} aria-disabled={disabled || undefined}>
    {items.map(item => <label className="ad-button-group-option" key={item.value}>
      <input
        className="ad-button-group-input"
        type="radio"
        name={name ?? generatedName}
        value={item.value}
        checked={selected === item.value}
        disabled={disabled || item.disabled}
        required={required}
        onChange={() => {
          if (disabled || item.disabled) return;
          if (value === undefined) setLocalValue(item.value);
          onChange?.(item.value, item);
        }}
      />
      <span className="ad-button-group-face">{item.label}</span>
    </label>)}
  </div>;
}
