import React from 'react';
import { SourceReference, SourceType } from '../types';
import { ExternalLink } from '@/components/ui/external-link';
import { formatEnglishDate } from '@/lib/dates';

export interface SourceListProps {
  sources: SourceReference[];
}

const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  official_terms: 'Terms of Service',
  official_help: 'Help Center & FAQ',
  official_pricing: 'Official Pricing',
  official_contact: 'Contact Information',
  authority: 'Consumer Protection Authority',
  other: 'Other Source',
};

function isValidExternalUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function SourceList({ sources }: SourceListProps) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <section id="kallor" aria-labelledby="kallor-heading" className="flex flex-col gap-4 scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 id="kallor-heading" className="text-base font-normal text-[var(--color-text)]">
          Sources & References
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          The information in this guide is based on the following official and public sources.
        </p>
      </div>

      <div className="flex flex-col divide-y divide-[var(--color-border)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle">
        {sources.map((source) => {
          const typeLabel = SOURCE_TYPE_LABELS[source.sourceType] || source.sourceType;
          const hasValidUrl = isValidExternalUrl(source.url);

          return (
            <div key={source.id} className="p-4 sm:p-5 flex flex-col gap-1.5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex flex-col gap-0.5">
                  {hasValidUrl ? (
                    <ExternalLink href={source.url} className="font-semibold text-sm text-[var(--color-text)] hover:text-[var(--color-accent)]">
                      {source.title}
                    </ExternalLink>
                  ) : (
                    <span className="font-semibold text-sm text-[var(--color-text)]">
                      {source.title}
                    </span>
                  )}
                  <span className="text-xs text-[var(--color-text-subtle)]">
                    {typeLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--color-text-subtle)]">
                  {source.retrievedAt && (
                    <span>
                      Accessed: {formatEnglishDate(source.retrievedAt, 'short')}
                    </span>
                  )}
                  {source.verifiedAt && (
                    <span>
                      Verified: {formatEnglishDate(source.verifiedAt, 'short')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
