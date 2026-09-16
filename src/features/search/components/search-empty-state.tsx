import React from 'react';
import { Link } from '@/i18n/navigation';
import { Calculator, FileText, Search, AlertCircle } from 'lucide-react';

export interface SearchEmptyStateProps {
  type: 'empty' | 'no_results' | 'invalid_query' | 'unavailable';
  query?: string;
}

export function SearchEmptyState({ type, query }: SearchEmptyStateProps) {
  if (type === 'empty') {
    return (
      <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-center flex flex-col items-center gap-3 shadow-subtle">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-page-subtle)] text-[var(--color-text-subtle)] flex items-center justify-center border border-[var(--color-border)]">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <p className="font-semibold text-sm text-[var(--color-text)]">
          Type the name of the service you want to cancel in the search box above.
        </p>
        {/* <p className="text-xs text-[var(--color-text-muted)] max-w-md leading-relaxed">
          Search only by service name. Do not enter personal details or ID numbers.
        </p> */}
      </div>
    );
  }

  if (type === 'invalid_query') {
    return (
      <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-center flex flex-col items-center gap-3 shadow-subtle">
        <p className="font-semibold text-sm text-[var(--color-text)]">
          Invalid search query
        </p>
        <p className="text-xs text-[var(--color-text-muted)] max-w-md leading-relaxed">
          Query must be 1–100 characters and cannot contain prohibited control characters.
        </p>
      </div>
    );
  }

  if (type === 'unavailable') {
    return (
      <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col items-center text-center gap-4 shadow-subtle">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-warning-surface)] text-[var(--color-warning)] flex items-center justify-center border border-[var(--color-warning-border)]">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <p className="font-semibold text-sm text-[var(--color-text)]">
            Service catalog is currently unavailable
          </p>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            We could not reach the search service right now. Please try again shortly or use our tools below.
          </p>
        </div>
        <div className="w-full max-w-md pt-3 border-t border-[var(--color-border)] flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <Link
              href="/verktyg/uppsagningsmeddelande"
              className="p-3 bg-[var(--color-page)] hover:bg-[var(--color-surface-interactive)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center gap-2 text-xs font-medium text-[var(--color-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
            >
              <FileText className="w-4 h-4 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
              <span>Create own message</span>
            </Link>
            <Link
              href="/verktyg/besparingskalkylator"
              className="p-3 bg-[var(--color-page)] hover:bg-[var(--color-surface-interactive)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center gap-2 text-xs font-medium text-[var(--color-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
            >
              <Calculator className="w-4 h-4 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
              <span>Calculate savings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col items-center text-center gap-5 shadow-subtle">
      <div className="flex flex-col gap-1.5 max-w-lg">
        <p className="font-semibold text-base text-[var(--color-text)]">
          No guides found for &ldquo;{query}&rdquo;
        </p>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
          Check your spelling or try a shorter name. Search only for the service name.
        </p>
      </div>

      <div className="w-full max-w-md pt-4 border-t border-[var(--color-border)] flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-[var(--color-text-subtle)] text-center">
          Can&apos;t find your service?
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
          <Link
            href="/verktyg/uppsagningsmeddelande"
            className="p-3 bg-[var(--color-page)] hover:bg-[var(--color-surface-interactive)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center gap-2.5 text-xs font-medium text-[var(--color-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <FileText className="w-4 h-4 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
            <span>Create own message</span>
          </Link>
          <Link
            href="/verktyg/besparingskalkylator"
            className="p-3 bg-[var(--color-page)] hover:bg-[var(--color-surface-interactive)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center gap-2.5 text-xs font-medium text-[var(--color-text)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <Calculator className="w-4 h-4 text-[var(--color-accent)] shrink-0" aria-hidden="true" />
            <span>Calculate savings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
