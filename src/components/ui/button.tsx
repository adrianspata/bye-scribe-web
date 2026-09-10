import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'quiet' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon-only';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none relative ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'min-h-[36px] px-3 py-1.5 text-xs rounded-[var(--radius-sm)] gap-1.5',
    md: 'min-h-[44px] px-4 py-2.5 text-sm rounded-[var(--radius-md)] gap-2',
    lg: 'min-h-[48px] px-6 py-3 text-base rounded-[var(--radius-lg)] gap-2.5',
    'icon-only': 'w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 rounded-[var(--radius-md)] flex items-center justify-center',
  };

  const variantStyles = {
    primary:
      'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] shadow-sm font-semibold',
    secondary:
      'bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-interactive-hover)] border border-[var(--color-border-strong)] shadow-xs',
    quiet:
      'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-interactive)] border border-transparent',
    destructive:
      'bg-[var(--color-critical)] text-white hover:opacity-90 shadow-sm font-semibold',
  };

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
          {size !== 'icon-only' && <span>{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
}
