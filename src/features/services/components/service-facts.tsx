import React from 'react';
import { ServiceDetail, CancellationChannel, NoticePeriodUnit } from '../types';
import { Card } from '@/components/ui/card';

export interface ServiceFactsProps {
  service: ServiceDetail;
}

const CHANNEL_LABELS: Record<CancellationChannel, string> = {
  website: 'Website / Account Settings',
  app: 'Mobile App',
  email: 'Email',
  phone: 'Phone',
  postal_mail: 'Mail / Paper Form',
  in_person: 'In Person / Store',
  reseller: 'Reseller / App Store',
  multiple: 'Multiple Channels',
  unknown: 'Information Unavailable',
};

function formatNoticePeriod(unit: NoticePeriodUnit, val?: number | null): string {
  if (unit === 'days') {
    if (val === 0) return 'No notice period (0 days)';
    if (typeof val === 'number') return `${val} days notice period`;
    return 'Days (unspecified)';
  }
  if (unit === 'calendar_months') {
    return `${val || 1} calendar month(s)`;
  }
  if (unit === 'billing_cycles') {
    return `${val || 1} billing cycle(s)`;
  }
  return 'Information unavailable';
}

export function ServiceFacts({ service }: ServiceFactsProps) {
  const channelText = CHANNEL_LABELS[service.cancellationChannel] || 'Information unavailable';
  const hasNoticePeriod =
    service.noticePeriodUnit !== 'unknown' &&
    service.noticePeriodValue !== null &&
    service.noticePeriodValue !== undefined;
  const noticeText = hasNoticePeriod
    ? formatNoticePeriod(service.noticePeriodUnit, service.noticePeriodValue)
    : null;

  return (
    <Card
      variant="raised"
      as="section"
      id="snabbfakta"
      aria-labelledby="snabbfakta-heading"
      className="flex flex-col gap-4 scroll-mt-24"
    >
      <h2 id="snabbfakta-heading" className="text-base font-normal text-[var(--color-text)]">
        Quick Overview
      </h2>
      <div className={`grid grid-cols-1 ${hasNoticePeriod ? 'sm:grid-cols-2' : ''} gap-4 text-sm`}>
        <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-text-muted)]">Primary cancellation channel</span>
          <span className="font-semibold text-[var(--color-text)]">
            {channelText}
          </span>
        </div>

        {hasNoticePeriod && (
          <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-text-muted)]">Notice period</span>
            <span className="font-semibold text-[var(--color-text)]">
              {noticeText}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
