import React from 'react';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <span
      data-testid="brand-logo"
      className={`inline-flex items-baseline tracking-tight text-[var(--color-text)] select-none ${sizeClasses[size]} ${className}`.trim()}
    >
      <span className="font-bold">Bye</span>
      <span className="font-light">Scribe</span>
    </span>
  );
}
