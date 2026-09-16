import React from 'react';
import Image from 'next/image';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function Logo({ className = '', size = 'md', showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg gap-0.5 sm:gap-1',
    md: 'text-lg sm:text-xl gap-0.5 sm:gap-1',
    lg: 'text-2xl sm:text-3xl gap-1',
  };

  return (
    <span
      data-testid="brand-logo"
      className={`inline-flex items-center tracking-tight text-[var(--color-text)] select-none ${sizeClasses[size]} ${className}`.trim()}
    >
      {showIcon && (
        <Image
          src="/byescribeFavicor.png"
          alt="ByeScribe icon"
          width={24}
          height={24}
          className="h-[0.95em] w-[0.95em] object-contain shrink-0"
          priority={size === 'md'}
          unoptimized
        />
      )}
      <span className="inline-flex items-baseline">
        <span className="font-bold">Bye</span>
        <span className="font-light">Scribe</span>
      </span>
    </span>
  );
}
