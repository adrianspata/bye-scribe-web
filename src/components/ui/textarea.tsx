import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({
  hasError = false,
  className = '',
  rows = 3,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={hasError ? 'true' : undefined}
      className={`w-full p-3.5 text-sm bg-[var(--color-surface)] text-[var(--color-text)] border rounded-[var(--radius-md)] placeholder:text-[var(--color-text-subtle)] transition-colors leading-relaxed focus:outline-none focus-visible:outline-none ${
        hasError
          ? 'border-[var(--color-critical)] focus:border-[var(--color-critical)]'
          : 'border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]'
      } ${className}`.trim()}
      {...props}
    />
  );
}
