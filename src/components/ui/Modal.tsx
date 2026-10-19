import type * as React from 'react';
import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export interface ModalProps {
  title: string;
  children?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
  footer?: React.ReactNode;
  closeLabel?: string;
}

export function Modal({ title, children, open = false, onClose, footer, closeLabel = 'Close' }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLSpanElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.querySelector('button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onCloseRef.current?.(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [open]);
  if (!open) return null;
  return <div className="ad-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose?.(); }}>
    <div ref={dialogRef} className="ad-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="ad-modal-head"><strong id={titleId}>{title}</strong><span ref={closeRef}><IconButton icon={X} label={closeLabel} onClick={onClose}/></span></div>
      <div className="ad-modal-body">{children}</div>{footer && <div className="ad-modal-footer">{footer}</div>}
    </div>
  </div>;
}
