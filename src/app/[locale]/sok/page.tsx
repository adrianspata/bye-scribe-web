import React from 'react';
import type { Metadata } from 'next';
import { SearchBar } from '@/features/search/components/search-bar';
import { SearchResultItem } from '@/features/search/components/search-result-item';
import { SearchEmptyState } from '@/features/search/components/search-empty-state';
import { getServiceRepository } from '@/features/services/repository';
import { searchQuerySchema, SearchResult } from '@/features/search/types';
import { getDataSourceMode } from '@/lib/env';
import { DatabaseUnconfiguredError } from '@/lib/errors';

export const metadata: Metadata = {
  title: 'Search Cancellation Guides',
  description: 'Search objective cancellation guides for subscriptions and memberships.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/en/sok',
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const isFixtureMode = getDataSourceMode() === 'fixtures';
  const hasRawQuery = typeof q === 'string' && q.length > 0;

  let validatedQuery: string | null = null;
  let isInvalidQuery = false;

  if (hasRawQuery) {
    const parseResult = searchQuerySchema.safeParse({ query: q });
    if (parseResult.success) {
      validatedQuery = parseResult.data.query;
    } else {
      isInvalidQuery = true;
    }
  }

  let results: SearchResult[] = [];
  let isServiceUnavailable = false;

  if (validatedQuery) {
    try {
      const repo = getServiceRepository();
      results = await repo.searchServices({ query: validatedQuery });
    } catch (err) {
      if (err instanceof DatabaseUnconfiguredError) {
        isServiceUnavailable = true;
      } else {
        // Unexpected repository/SQL/schema errors bubble up to Next.js error boundary
        throw err;
      }
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[var(--color-text)]">
          Search for a cancellation guide
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          Find cancellation steps, terms, and official contact paths for your subscriptions.
        </p>
        <div className="mt-2">
          <SearchBar initialQuery={q || ''} autoFocus={!q} />
        </div>
      </header>

      {isInvalidQuery ? (
        <SearchEmptyState type="invalid_query" />
      ) : isServiceUnavailable ? (
        <SearchEmptyState type="unavailable" />
      ) : validatedQuery ? (
        <section aria-labelledby="results-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h2 id="results-heading" className="text-sm font-normal text-[var(--color-text-muted)]">
              {results.length === 1
                ? `1 guide found for “${validatedQuery}”`
                : results.length > 1
                ? `${results.length} guides found for “${validatedQuery}”`
                : `No guides found`}
            </h2>
            {isFixtureMode && (
              <span className="text-xs text-[var(--color-text-muted)]">Sample data</span>
            )}
          </div>

          {results.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.map((result) => (
                <SearchResultItem key={result.serviceId} result={result} />
              ))}
            </div>
          ) : (
            <SearchEmptyState type="no_results" query={validatedQuery} />
          )}
        </section>
      ) : (
        <SearchEmptyState type="empty" />
      )}
    </div>
  );
}
