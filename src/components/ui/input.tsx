import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({
  hasError = false,
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      aria-invalid={hasError ? 'true' : undefined}
      className={`w-full min-h-[44px] px-3.5 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] border rounded-[var(--radius-md)] placeholder:text-[var(--color-text-subtle)] transition-colors focus:outline-none focus-visible:outline-none ${
        hasError
          ? 'border-[var(--color-critical)] focus:border-[var(--color-critical)]'
          : 'border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]'
      } ${className}`.trim()}
      {...props}
    />
  );
}
