import React from 'react';
import { useTranslations } from 'next-intl';
import { clientEnv } from '@/lib/env';
import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

export function SummaCard() {
  const t = useTranslations('home');
  const summaUrl = clientEnv.NEXT_PUBLIC_SUMMA_APP_STORE_URL || '#';

  return (
    <section
      aria-labelledby="summa-heading"
      className="w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-[var(--radius-lg)] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-subtle"
    >
      <div className="flex flex-col gap-2 max-w-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-accent)]">
            Relaterat verktyg
          </span>
        </div>
        <h2 id="summa-heading" className="text-base sm:text-lg font-normal text-[var(--color-text)]">
          {t('summaCardTitle')}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
          {t('summaCardDescription')}
        </p>
      </div>

      <a
        href={summaUrl}
        target={summaUrl.startsWith('http') ? '_blank' : undefined}
        rel={summaUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
      >
        <span>{t('summaCardCta')}</span>
        {summaUrl.startsWith('http') && (
          <ExternalLinkIcon className="w-3.5 h-3.5 opacity-90" aria-hidden="true" />
        )}
      </a>
    </section>
  );
}
