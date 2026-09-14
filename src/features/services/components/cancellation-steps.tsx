import React from 'react';
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

export function CancellationSteps({ steps, serviceName }: CancellationStepsProps) {
  const sortedSteps = [...steps].sort((a, b) => a.position - b.position);

  return (
    <section id="steg" aria-labelledby="steg-heading" className="flex flex-col gap-6 scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 id="steg-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Uppsägningssteg för {serviceName}
        </h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Följ stegen i ordning för att genomföra uppsägningen hos leverantören.
        </p>
      </div>

      {sortedSteps.length > 0 ? (
        <ol className="relative flex flex-col gap-4 list-none p-0 m-0">
          {sortedSteps.map((step, index) => {
            const isLast = index === sortedSteps.length - 1;
            return (
              <li
                key={step.id || step.position}
                className="relative flex gap-4 p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle"
              >
                {/* Node indicator: 44x44 B&W number circle */}
                <div className="flex flex-col items-center shrink-0">
                  <span
                    className="w-11 h-11 rounded-full bg-[var(--color-text)] text-[var(--color-page)] font-bold text-sm flex items-center justify-center tabular-nums shrink-0 select-none shadow-sm"
                    aria-hidden="true"
                  >
                    {step.position}
                  </span>
                  {!isLast && (
                    <div
                      className="w-0.5 bg-[var(--color-border)] flex-1 my-2 hidden sm:block"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-[var(--color-text)]">
                    <span className="sr-only">Steg {step.position}: </span>
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                    {step.instruction}
                  </p>

                  {step.source && isValidExternalUrl(step.source.url) && (
                    <div className="text-xs text-[var(--color-text-subtle)] mt-2 flex items-center gap-1.5">
                      <span>Källa:</span>
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
          Inga detaljerade steg publicerade för denna tjänst ännu.
        </div>
      )}
    </section>
  );
}
