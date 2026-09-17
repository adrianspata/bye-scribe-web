import React from 'react';
import { CurrencyCode, SavingsProjection, formatMoney } from '@/lib/money';
import { SignalField } from '@/components/visual/signal-field';

export interface SavingsResultProps {
  projection: SavingsProjection;
  currency?: CurrencyCode;
}

export function SavingsResult({ projection, currency = 'SEK' }: SavingsResultProps) {
  return (
    <div
      aria-live="polite"
      className="relative rounded-[var(--radius-lg)] p-6 sm:p-7 bg-[var(--color-surface)] border border-[var(--color-border-strong)] overflow-hidden shadow-raised flex flex-col gap-5"
    >
      {/* Decorative SignalField Layer with Controlled Contrast */}
      <SignalField variant="tool" className="rounded-[var(--radius-lg)] opacity-70" />

      <div className="relative z-10 flex flex-col gap-4">
        <h3 className="text-sm font-normal text-[var(--color-text)]">
          Estimated Savings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Monthly */}
          <div className="p-4 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              Potential monthly savings
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tabular-nums">
              {formatMoney(projection.monthlyMinor, { inMinor: true, currency, interval: 'month' })}
            </span>
          </div>

          {/* 1 Year */}
          <div className="p-4 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              1-year projection
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tabular-nums">
              {formatMoney(projection.yearlyMinor, { inMinor: true, currency })}
            </span>
          </div>

          {/* 5 Years */}
          <div className="p-4 bg-[var(--color-surface-raised)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              5-year projection
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tabular-nums">
              {formatMoney(projection.fiveYearMinor, { inMinor: true, currency })}
            </span>
          </div>
        </div>

        <p className="text-xs text-[var(--color-text-subtle)] leading-relaxed pt-1 border-t border-[var(--color-border-subtle)]">
          This estimate assumes an unchanged price and represents a potential projection, not a guaranteed financial outcome.
        </p>
      </div>
    </div>
  );
}
