import React from 'react';
import { ServiceDetail } from '../types';
import { InlineNotice } from '@/components/ui/inline-notice';
import { SignalField } from '@/components/visual/signal-field';
import { formatSwedishDate } from '@/lib/dates';
import { Building2, CheckCircle2 } from 'lucide-react';

export interface ServiceGuideHeaderProps {
  service: ServiceDetail;
  isFixtureMode: boolean;
}

export function ServiceGuideHeader({ service, isFixtureMode }: ServiceGuideHeaderProps) {
  const isStale = service.verificationStatus === 'stale';

  return (
    <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-8">
      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          {service.category?.name && (
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              {service.category.name}
            </span>
          )}
        </div>

        {/* Verification date: only display as verified if real PostgreSQL data (not fixtures) */}
        {!isFixtureMode && service.lastVerifiedAt && !isStale && (
          <span className="text-xs text-[var(--color-text-subtle)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)]" aria-hidden="true" />
            <span>Verifierad {formatSwedishDate(service.lastVerifiedAt, 'long')}</span>
          </span>
        )}
      </div>

      {/* Demo / Stale notices */}
      {isFixtureMode && (
        <div className="py-2.5 px-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs text-[var(--color-text)] leading-relaxed">
          Lokal demo – informationen är inte en verkligt verifierad tjänsteguide.
        </div>
      )}

      {isStale && !isFixtureMode && (
        <InlineNotice variant="warning" title="Behöver ny granskning">
          Denna guide är i behov av ny granskning. Villkor och kontaktvägar kan ha ändrats hos leverantören.
        </InlineNotice>
      )}

      {/* Hero Title & Subtle SignalField Container (max 1 signal moment in guide) */}
      <div className="relative rounded-[var(--radius-lg)] p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-subtle">
        <SignalField variant="editorial" className="rounded-[var(--radius-lg)]" />
        
        <div className="relative z-10 flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.1]">
            Säg upp {service.name}
          </h1>

          {service.summary && (
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
              {service.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-[var(--color-text-subtle)] pt-2 flex-wrap">
            <span className="font-medium text-[var(--color-text-muted)]">
              Uppsägningen genomförs hos leverantören.
            </span>
            {service.legalName && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" aria-hidden="true" />
                <span>Juridiskt namn: {service.legalName}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
