import React from 'react';
import { useTranslations } from 'next-intl';
import { CancellationStep } from '../types';
import { ExternalLink } from '@/components/ui/external-link';

export interface CancellationStepsProps {
  steps: CancellationStep[];
  serviceName: string;
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

export function CancellationSteps({ steps }: CancellationStepsProps) {
  const t = useTranslations('serviceGuide');
  const sortedSteps = [...steps].sort((a, b) => a.position - b.position);

  return (
    <section id="steg" aria-labelledby="steg-heading" className="flex flex-col gap-6 scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 id="steg-heading" className="text-xl sm:text-2xl font-normal tracking-tight text-[var(--color-text)]">
          {t('stepsHeading')}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          {t('providerExecution')}
        </p>
      </div>

      {sortedSteps.length > 0 ? (
        <ol className="relative flex flex-col gap-4 list-none p-0 m-0">
          {sortedSteps.map((step) => {
            return (
              <li
                key={step.id || step.position}
                className="group relative flex items-start gap-4 p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-subtle hover:border-[var(--color-border-strong)] transition-all"
              >
                {/* Step number badge (44x44px for clear visual weight) */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-11 h-11 rounded-full bg-[var(--color-text)] text-[var(--color-page)] font-bold text-sm flex items-center justify-center tabular-nums shrink-0 select-none shadow-sm"
                    aria-hidden="true"
                  >
                    {step.position}
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 flex flex-col gap-2 min-w-0 pt-0.5 text-left">
                  <h3 className="font-normal text-base text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>

                  {step.source && isValidExternalUrl(step.source.url) && (
                    <div className="text-xs text-[var(--color-text-subtle)] mt-2 flex items-center gap-1.5">
                      <span>{t('sourceLabel')}</span>
                      <ExternalLink href={step.source.url}>
                        {step.source.title}
                      </ExternalLink>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-sm text-[var(--color-text-muted)] shadow-subtle">
          {t('noSteps')}
        </div>
      )}
    </section>
  );
}
