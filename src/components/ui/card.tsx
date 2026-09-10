import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'interactive' | 'highlight';
  as?: 'div' | 'section' | 'article';
  hasPathStep?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  as: Component = 'div',
  hasPathStep = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-subtle',
    raised:
      'bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] shadow-raised',
    interactive:
      'bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all cursor-pointer',
    highlight:
      'bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 shadow-subtle',
  };

  return (
    <Component
      className={`rounded-[var(--radius-lg)] p-5 sm:p-6 relative ${
        hasPathStep ? 'border-l-4 border-l-[var(--color-accent)]' : ''
      } ${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}
