import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({
  hasError = false,
  className = '',
  children,
  ...props
}: SelectProps) {
  return (
    <div className="relative w-full">
      <select
        aria-invalid={hasError ? 'true' : undefined}
        className={`w-full min-h-[44px] pl-3.5 pr-10 py-2 text-sm bg-[var(--color-surface)] text-[var(--color-text)] border rounded-[var(--radius-md)] appearance-none cursor-pointer transition-colors focus:outline-none focus-visible:outline-none ${
          hasError
            ? 'border-[var(--color-critical)] focus:border-[var(--color-critical)]'
            : 'border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)]'
        } ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--color-text-muted)]">
        <ChevronDown className="w-4 h-4" aria-hidden="true" />
      </div>
    </div>
  );
}
