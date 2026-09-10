import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'critical' | 'info' | 'danger';
  children: React.ReactNode;
}

export function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const normalizedVariant = variant === 'danger' ? 'critical' : variant;

  const variantStyles = {
    neutral:
      'bg-[var(--color-surface-interactive)] text-[var(--color-text-muted)] border-[var(--color-border)]',
    success:
      'bg-[var(--color-positive-surface)] text-[var(--color-positive)] border-[var(--color-positive-border)]',
    warning:
      'bg-[var(--color-warning-surface)] text-[var(--color-warning)] border-[var(--color-warning-border)]',
    critical:
      'bg-[var(--color-critical-surface)] text-[var(--color-critical)] border-[var(--color-critical-border)]',
    info:
      'bg-[var(--color-information-surface)] text-[var(--color-information)] border-[var(--color-information-border)]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-pill)] text-xs font-medium border ${variantStyles[normalizedVariant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export const StatusBadge = Badge;
