import React from 'react';
import { Card } from '@/components/ui/card';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

export interface OfficialCancellationActionProps {
  serviceName: string;
  officialCancellationUrl?: string | null;
  websiteUrl?: string | null;
}

function isValidExternalUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function OfficialCancellationAction({
  serviceName,
  officialCancellationUrl,
  websiteUrl,
}: OfficialCancellationActionProps) {
  const hasOfficialUrl = isValidExternalUrl(officialCancellationUrl);
  const hasWebsiteUrl = isValidExternalUrl(websiteUrl);

  if (!hasOfficialUrl && !hasWebsiteUrl) {
    return null;
  }

  if (hasOfficialUrl) {
    return (
      <Card
        variant="raised"
        as="section"
        aria-labelledby="official-action-heading"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 bg-[var(--color-surface)] border border-[var(--color-border-strong)]"
      >
        <div className="flex flex-col gap-1">
          <h2 id="official-action-heading" className="text-base font-normal text-[var(--color-text)]">
            Official cancellation path
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            You will leave ByeScribe and complete cancellation on the provider&apos;s website.
          </p>
        </div>

        <a
          href={officialCancellationUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)] hover:bg-[var(--color-btn-primary-hover)] transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
        >
          <span>Go to {serviceName}</span>
          <ExternalLinkIcon className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Card>
    );
  }

  return (
    <Card
      variant="default"
      as="section"
      aria-labelledby="website-link-heading"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="website-link-heading" className="text-sm font-normal text-[var(--color-text)]">
          Official website
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          No direct cancellation link available. Visit the provider&apos;s website for customer support and account login.
        </p>
      </div>

      <a
        href={websiteUrl!}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2 text-xs font-semibold rounded-[var(--radius-md)] bg-[var(--color-btn-secondary-bg)] text-[var(--color-btn-secondary-text)] border border-[var(--color-btn-secondary-border)] hover:bg-[var(--color-btn-secondary-hover)] transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
      >
        <span>Visit {serviceName}&apos;s website</span>
        <ExternalLinkIcon className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Card>
  );
}
