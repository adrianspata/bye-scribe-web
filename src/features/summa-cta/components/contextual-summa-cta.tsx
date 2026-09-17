import React from 'react';
import { clientEnv } from '@/lib/env';
import { SignalField } from '@/components/visual/signal-field';
import { TypingSectionHeading } from '@/components/ui/typing-section-heading';

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
    title: 'Get full control of your recurring expenses with Summa',
    description:
      'Discover unwanted subscriptions and track your spending directly on your phone.',
    ctaText: 'Download Summa',
  },
  service_detail: {
    title: 'Keep track of your remaining subscriptions with Summa',
    description:
      'Once you cancel this service, Summa helps you keep an overview of remaining fixed expenses and upcoming charges.',
    ctaText: 'Track with Summa',
  },
  savings_calculator: {
    title: 'Track your saved money and recurring costs',
    description:
      'Use Summa to track how much you save each month by removing unused subscriptions.',
    ctaText: 'Optimize finances in Summa',
  },
  cancellation_message: {
    title: 'Set up reminders and tracking in Summa',
    description:
      'Set a reminder in Summa so you can verify that direct debits or card charges have stopped.',
    ctaText: 'Monitor in Summa',
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
      className={`relative w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] shadow-subtle overflow-hidden ${className}`.trim()}
    >
      <SignalField variant="summa" className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-xl text-left">
          <TypingSectionHeading
            id={`summa-heading-${context}`}
            text={content.title}
            className="text-base sm:text-lg font-normal text-[var(--color-text)]"
          />
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
            {content.description}
          </p>
        </div>
        {validUrl ? (
          <a
            href={validUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-btn-primary-bg)] text-[var(--color-btn-primary-text)] hover:bg-[var(--color-btn-primary-hover)] border border-transparent shadow-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 shrink-0"
          >
            {content.ctaText}
          </a>
        ) : (
          <div className="text-xs text-[var(--color-text-muted)] border border-[var(--color-border)] bg-[var(--color-surface-interactive)] px-3.5 py-2 rounded-[var(--radius-md)] shrink-0">
            Summa is available on the App Store
          </div>
        )}
      </SignalField>
    </aside>
  );
}
