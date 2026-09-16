import React from 'react';

interface SkipLinkProps {
  children?: React.ReactNode;
  targetId?: string;
}

export function SkipLink({
  children = 'Skip to main content',
  targetId = 'main-content',
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[var(--color-surface)] focus:text-[var(--color-text)] focus:border focus:border-[var(--color-border-strong)] focus:rounded-[var(--radius-md)] focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] font-medium text-sm transition-all"
    >
      {children}
    </a>
  );
}
