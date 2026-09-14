import React from 'react';
import { ServicePrice } from '../types';
import { formatMoneySEK } from '@/lib/money';
import { formatSwedishDate } from '@/lib/dates';

export interface ServicePricesSectionProps {
  prices: ServicePrice[];
  isFixtureMode: boolean;
}

export function ServicePricesSection({
  prices,
  isFixtureMode,
}: ServicePricesSectionProps) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    <section id="priser" aria-labelledby="priser-heading" className="flex flex-col gap-4 scroll-mt-24">
      <div className="flex flex-col gap-1">
        <h2 id="priser-heading" className="text-base font-semibold text-[var(--color-text)]">
          Kända prisplaner
        </h2>
        {isFixtureMode && (
          <p className="text-xs text-[var(--color-text-subtle)]">
            Prisexemplen är fiktiva för demonstrationsändamål.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prices.map((price) => {
          const intervalStr =
            price.billingInterval === 'monthly'
              ? 'month'
              : price.billingInterval === 'yearly'
              ? 'year'
              : undefined;

          return (
            <div
              key={price.id}
              className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1.5 shadow-subtle"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm text-[var(--color-text)]">
                  {price.planName}
                </span>
                <span className="text-sm font-bold text-[var(--color-text)] tabular-nums">
                  {formatMoneySEK(price.amountMinor, { inMinor: true, interval: intervalStr })}
                </span>
              </div>

              {(price.validFrom || price.validTo) && (
                <span className="text-xs text-[var(--color-text-subtle)]">
                  {price.validFrom && `Gäller från: ${formatSwedishDate(price.validFrom, 'short')}`}
                  {price.validTo && ` till ${formatSwedishDate(price.validTo, 'short')}`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
