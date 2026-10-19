import type * as React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neutral' | 'primary' | 'outline' | 'download' | (string & {});
  icon?: LucideIcon;
}

export function Button({ children, variant = 'neutral', icon: Icon, className = '', type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={`ad-button ad-button--${variant} ${className}`.trim()} {...props}>
    {Icon && <Icon size={13} strokeWidth={1.8} aria-hidden="true"/>}
    {children}
  </button>;
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
}

export function IconButton({ icon: Icon, label, className = '', title = label, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} className={`ad-icon-button ${className}`.trim()} aria-label={label} title={title} {...props}>
    <Icon size={15} strokeWidth={1.8} aria-hidden="true"/>
  </button>;
}

export interface TextLinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function TextLink({ children, className = '', type = 'button', ...props }: TextLinkProps) {
  return <button type={type} className={`ad-text-link ${className}`.trim()} {...props}>{children}</button>;
}
