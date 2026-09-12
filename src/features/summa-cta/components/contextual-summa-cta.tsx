import React from 'react';
import { clientEnv } from '@/lib/env';
import { SignalField } from '@/components/visual/signal-field';

export type SummaCtaContext =
  | 'homepage'
  | 'service_detail'
  | 'savings_calculator'
  | 'cancellation_message';

export interface ContextualSummaCtaProps {
  context?: SummaCtaContext;
  className?: string;
}

const CONTEXT_CONTENT: Record<
  SummaCtaContext,
  { title: string; description: string; ctaText: string }
> = {
  homepage: {
    title: 'Få full koll på dina fasta utgifter med Summa',
    description:
      'Upptäck onödiga prenumerationer och spåra dina kostnader direkt i mobilen.',
    ctaText: 'Ladda ner Summa',
  },
  service_detail: {
    title: 'Håll koll på resten av dina abonnemang med Summa',
    description:
      'När du avslutat denna tjänst hjälper Summa dig att få överblick över kvarvarande fasta utgifter och kommande dragningar.',
    ctaText: 'Få koll med Summa',
  },
  savings_calculator: {
    title: 'Samla dina sparade pengar och återkommande kostnader',
    description:
      'Använd Summa för att spåra hur mycket du sparar varje månad genom att rensa bort oanvända abonnemang.',
    ctaText: 'Optimera ekonomin i Summa',
  },
  cancellation_message: {
    title: 'Lägg till nästa betalning och bevakning i Summa',
    description:
      'Sätt en påminnelse i Summa så att du kan verifiera att autogirot eller kortdragningen verkligen har upphört.',
    ctaText: 'Bevaka i Summa',
  },
};

export function ContextualSummaCta({
  context = 'homepage',
  className = '',
}: ContextualSummaCtaProps) {
  const content = CONTEXT_CONTENT[context];
  const rawUrl = clientEnv.NEXT_PUBLIC_SUMMA_APP_STORE_URL;

  let validUrl: string | null = null;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(rawUrl);
      urlObj.searchParams.set('utm_source', 'byescribe');
      urlObj.searchParams.set('utm_medium', 'cta');
      urlObj.searchParams.set('utm_campaign', context);
      validUrl = urlObj.toString();
    } catch {
      validUrl = null;
    }
  }

  return (
    <aside
      aria-labelledby={`summa-heading-${context}`}
      className={`relative w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle overflow-hidden ${className}`.trim()}
    >
      <SignalField variant="summa" className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2
            id={`summa-heading-${context}`}
            className="text-base sm:text-lg font-semibold text-[var(--color-text)]"
          >
            {content.title}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {content.description}
          </p>
        </div>
        {validUrl ? (
          <a
            href={validUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)] hover:bg-[var(--color-btn-primary-hover)] border border-transparent shadow-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 shrink-0"
          >
            {content.ctaText}
          </a>
        ) : (
          <div className="text-xs text-[var(--color-text-muted)] border border-[var(--color-border)] bg-[var(--color-surface-interactive)] px-3.5 py-2 rounded-[var(--radius-md)] shrink-0">
            Summa finns i App Store
          </div>
        )}
      </SignalField>
    </aside>
  );
}
