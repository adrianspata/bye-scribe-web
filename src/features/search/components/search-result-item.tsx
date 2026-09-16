import React from 'react';
import { Link } from '@/i18n/navigation';
import { SearchResult } from '../types';
import { ChevronRight } from 'lucide-react';

export interface SearchResultItemProps {
  result: SearchResult;
}

export function SearchResultItem({ result }: SearchResultItemProps) {
  return (
    <Link
      href={`/tjanster/${result.slug}`}
      className="group p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2.5 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-semibold text-base sm:text-lg text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
              {result.name}
            </span>
            {result.categoryName && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-text-subtle)] border border-[var(--color-border-subtle)]">
                {result.categoryName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors shrink-0 mt-0.5">
          <span className="hidden sm:inline">View guide</span>
          <ChevronRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
        </div>
      </div>

      {result.summary && (
        <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
          {result.summary}
        </p>
      )}

      {result.matchedAlias && (
        <div className="text-xs text-[var(--color-text-subtle)] flex items-center gap-1">
          <span>Matched alias:</span>
          <span className="font-medium italic text-[var(--color-text-muted)]">{result.matchedAlias}</span>
        </div>
      )}
    </Link>
  );
}
