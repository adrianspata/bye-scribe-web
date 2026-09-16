import React from 'react';
import { Card } from '@/components/ui/card';

export interface ServiceTermsSectionProps {
  bindingNotes?: string | null;
  confirmationNotes?: string | null;
}

export function ServiceTermsSection({
  bindingNotes,
  confirmationNotes,
}: ServiceTermsSectionProps) {
  if (!bindingNotes && !confirmationNotes) {
    return null;
  }

  return (
    <Card
      variant="raised"
      as="section"
      id="villkor"
      aria-labelledby="villkor-heading"
      className="flex flex-col gap-4 scroll-mt-24"
    >
      <h2 id="villkor-heading" className="text-base font-normal text-[var(--color-text)]">
        Terms & Confirmation
      </h2>

      <div className="flex flex-col gap-4 text-sm divide-y divide-[var(--color-border)]">
        {bindingNotes && (
          <div className="flex flex-col gap-1 pt-1 first:pt-0">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              Contract duration & terms
            </span>
            <p className="text-[var(--color-text)] leading-relaxed">
              {bindingNotes}
            </p>
          </div>
        )}

        {confirmationNotes && (
          <div className="flex flex-col gap-1 pt-3 first:pt-0">
            <span className="text-xs font-semibold text-[var(--color-text-muted)]">
              Cancellation confirmation
            </span>
            <p className="text-[var(--color-text)] leading-relaxed">
              {confirmationNotes}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
