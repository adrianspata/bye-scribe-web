import React from 'react';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  href,
  className = '',
  showIcon = true,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-[var(--color-accent)] hover:underline font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-xs ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      {showIcon && (
        <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0 opacity-80" aria-hidden="true" />
      )}
      <span className="sr-only">(öppnas i ny flik)</span>
    </a>
  );
}
