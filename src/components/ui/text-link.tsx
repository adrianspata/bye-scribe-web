import React from 'react';
import { Link } from '@/i18n/navigation';

export interface TextLinkProps extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function TextLink({ className = '', children, ...props }: TextLinkProps) {
  return (
    <Link
      className={`text-[var(--color-accent)] hover:underline font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-xs ${className}`.trim()}
      {...props}
    >
      {children}
    </Link>
  );
}
