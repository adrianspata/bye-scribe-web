import React from 'react';
import { useTranslations } from 'next-intl';
import { ServiceDetail } from '../types';
import { Card } from '@/components/ui/card';

export interface ServiceFactsProps {
  service: ServiceDetail;
}

export function ServiceFacts({ service }: ServiceFactsProps) {
  const t = useTranslations('serviceGuide');
  const tChannels = useTranslations('channels');

  const channelText = tChannels.has(service.cancellationChannel)
    ? tChannels(service.cancellationChannel)
    : t('missingInfo');

  const hasNoticePeriod =
    service.noticePeriodUnit !== 'unknown' &&
    service.noticePeriodValue !== null &&
    service.noticePeriodValue !== undefined;

  let noticeText: string | null = null;
  if (hasNoticePeriod) {
    const val = service.noticePeriodValue ?? 0;
    if (service.noticePeriodUnit === 'days') {
      noticeText = t('noticeDays', { count: val });
    } else if (service.noticePeriodUnit === 'calendar_months') {
      noticeText = t('noticeMonths', { count: val });
    } else if (service.noticePeriodUnit === 'billing_cycles') {
      noticeText = t('noticeCycles', { count: val });
    }
  }

  return (
    <Card
      variant="raised"
      as="section"
      id="snabbfakta"
      aria-labelledby="snabbfakta-heading"
      className="flex flex-col gap-4 scroll-mt-24"
    >
      <h2 id="snabbfakta-heading" className="text-base font-normal text-[var(--color-text)]">
        {t('quickFactsHeading')}
      </h2>
      <div className={`grid grid-cols-1 ${hasNoticePeriod ? 'sm:grid-cols-2' : ''} gap-4 text-sm`}>
        <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-text-muted)]">{t('cancellationChannel')}</span>
          <span className="font-semibold text-[var(--color-text)]">
            {channelText}
          </span>
        </div>

        {hasNoticePeriod && (
          <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-text-muted)]">{t('noticePeriod')}</span>
            <span className="font-semibold text-[var(--color-text)]">
              {noticeText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
