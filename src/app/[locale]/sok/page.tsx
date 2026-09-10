import React from 'react';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { SearchBar } from '@/features/search/components/search-bar';
import { getServiceRepository } from '@/features/services/repository';
import { searchQuerySchema, SearchResult } from '@/features/search/types';
import { Badge } from '@/components/ui/badge';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';
import { getDataSourceMode } from '@/lib/env';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sökresultat',
  description: 'Sök efter verifierade instruktioner för att avsluta dina abonnemang.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/sv/sok',
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const isFixtureMode = getDataSourceMode() === 'fixtures';

  const parseResult = searchQuerySchema.safeParse({ query: q || '' });

  let results: SearchResult[] = [];
  const validatedQuery = parseResult.success ? parseResult.data.query : null;

  if (validatedQuery) {
    const repo = getServiceRepository();
    results = await repo.searchServices({ query: validatedQuery });
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
          Sök uppsägningsguide
        </h1>
        <SearchBar initialQuery={q || ''} autoFocus={!q} />
      </div>

      {validatedQuery ? (
        <section aria-labelledby="results-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h2 id="results-heading" className="text-sm font-semibold text-[var(--color-text-muted)]">
              {results.length === 1
                ? `1 träff för "${validatedQuery}"`
                : `${results.length} träffar för "${validatedQuery}"`}
            </h2>
            {isFixtureMode && (
              <Badge variant="warning">Lokal demo</Badge>
            )}
          </div>

          {results.length > 0 ? (
            <div className="flex flex-col gap-3">
              {results.map((result) => (
                <Link
                  key={result.serviceId}
                  href={`/tjanster/${result.slug}`}
                  className="group p-4 sm:p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-base text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                      {result.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {result.categoryName}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                    </div>
                  </div>

                  {result.summary && (
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 leading-relaxed">
                      {result.summary}
                    </p>
                  )}

                  {result.matchedAlias && (
                    <div className="text-xs text-[var(--color-text-subtle)]">
                      Matchade alias: <span className="italic">{result.matchedAlias}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-center flex flex-col items-center gap-2 shadow-subtle">
              <p className="font-semibold text-sm text-[var(--color-text)]">
                Inga resultat hittades för &ldquo;{validatedQuery}&rdquo;
              </p>
              <p className="text-xs text-[var(--color-text-muted)] max-w-md leading-relaxed">
                Kontrollera stavningen eller prova att söka på tjänstens officiella namn eller bransch (t.ex. &ldquo;streaming&rdquo;).
              </p>
            </div>
          )}
        </section>
      ) : (
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-sm text-[var(--color-text-muted)] shadow-subtle">
          Skriv in namnet på tjänsten du vill säga upp i sökfältet ovan.
        </div>
      )}

      <ContextualSummaCta context="homepage" className="mt-4" />
    </div>
  );
}
