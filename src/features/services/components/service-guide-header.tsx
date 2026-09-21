import React from 'react';
import { useTranslations } from 'next-intl';
import { ServiceDetail } from '../types';
import { InlineNotice } from '@/components/ui/inline-notice';
import { SignalField } from '@/components/visual/signal-field';
import { formatEnglishDate } from '@/lib/dates';
import { Building2, CheckCircle2 } from 'lucide-react';
import { CategoryConfigurationError } from '@/lib/errors';

export interface ServiceGuideHeaderProps {
  service: ServiceDetail;
  isFixtureMode: boolean;
}

export function ServiceGuideHeader({ service, isFixtureMode }: ServiceGuideHeaderProps) {
  const t = useTranslations('serviceGuide');
  const tCategories = useTranslations('categories');
  const isStale = service.verificationStatus === 'stale';

  let categoryName: string | null = null;
  if (service.category?.slug) {
    if (tCategories.has(service.category.slug)) {
      categoryName = tCategories(service.category.slug);
    } else {
      throw new CategoryConfigurationError(service.category.slug, 'active_locale');
    }
  }

  return (
    <header className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-8">
      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          {categoryName && (
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              {categoryName}
            </span>
          )}
        </div>

        {/* Verification date: only display as verified if real PostgreSQL data (not fixtures) and verified status */}
        {!isFixtureMode && service.lastVerifiedAt && !isStale && service.verificationStatus === 'verified' && (
          <span className="text-xs text-[var(--color-text-subtle)] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)]" aria-hidden="true" />
            <span>{t('lastVerified', { date: formatEnglishDate(service.lastVerifiedAt, 'long') })}</span>
          </span>
        )}
      </div>

      {/* Demo / Stale notices */}
      {isFixtureMode && (
        <div className="py-2.5 px-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-xs text-[var(--color-text)] leading-relaxed text-left">
          {t('demoNotice')}
        </div>
      )}

      {isStale && !isFixtureMode && (
        <InlineNotice variant="warning" title="Needs review">
          {t('staleNotice')}
        </InlineNotice>
      )}

      {/* Hero Title & Subtle SignalField Container */}
      <div className="relative rounded-[var(--radius-card-visual)] p-6 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-subtle">
        <SignalField variant="editorial" className="rounded-[var(--radius-card-visual)]" />
        
        <div className="relative z-10 flex flex-col gap-3 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--color-text)] leading-[1.1]">
            {t('cancelHeading', { name: service.name })}
          </h1>

          {service.summary && (
            <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
              {service.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-[var(--color-text-subtle)] pt-2 flex-wrap">
            <span className="font-medium text-[var(--color-text-muted)]">
              {t('providerExecution')}
            </span>
            {service.legalName && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" aria-hidden="true" />
                <span>{t('legalName')} {service.legalName}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
