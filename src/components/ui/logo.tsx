import React from 'react';
import Image from 'next/image';

export interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function Logo({ className = '', size = 'md', showIcon = true }: LogoProps) {
  const sizeClasses = {
    sm: 'text-base sm:text-lg gap-1.5',
    md: 'text-lg sm:text-xl gap-2',
    lg: 'text-2xl sm:text-3xl gap-2.5',
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
          width={28}
          height={28}
          className="h-[1.15em] w-[1.15em] object-contain shrink-0"
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
