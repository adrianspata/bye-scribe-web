import React from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

export interface ToolPageHeaderProps {
  category: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
}

export function ToolPageHeader({
  category,
  title,
  description,
  backHref = '/',
  backLabel = 'Tillbaka till start',
}: ToolPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-6">
      <nav aria-label="Tillbaka">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-sm)] py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{backLabel}</span>
        </Link>
      </nav>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-[var(--color-text-subtle)]">
          {category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
          {title}
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>
    </header>
  );
}
