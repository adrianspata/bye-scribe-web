import React from 'react';
import { ServiceDetail, CancellationChannel, NoticePeriodUnit } from '../types';
import { Card } from '@/components/ui/card';

export interface ServiceFactsProps {
  service: ServiceDetail;
}

const CHANNEL_LABELS: Record<CancellationChannel, string> = {
  website: 'Webbplats / Mina sidor',
  app: 'Mobilapplikation',
  email: 'E-post',
  phone: 'Telefon',
  postal_mail: 'Brev / Pappersblankett',
  in_person: 'På plats / Butik',
  reseller: 'Återförsäljare',
  multiple: 'Flera kontaktvägar',
  unknown: 'Uppgift saknas',
};

function formatNoticePeriod(unit: NoticePeriodUnit, val?: number | null): string {
  if (unit === 'days') {
    if (val === 0) return 'Ingen uppsägningstid (0 dagar)';
    if (typeof val === 'number') return `${val} dagars uppsägningstid`;
    return 'Dagar (antal ej specificerat)';
  }
  if (unit === 'calendar_months') {
    return `${val || 1} kalendermånad(er)`;
  }
  if (unit === 'billing_cycles') {
    return `${val || 1} faktureringsperiod(er)`;
  }
  return 'Uppgift saknas';
}

export function ServiceFacts({ service }: ServiceFactsProps) {
  const channelText = CHANNEL_LABELS[service.cancellationChannel] || 'Uppgift saknas';
  const noticeText = formatNoticePeriod(service.noticePeriodUnit, service.noticePeriodValue);

  return (
    <Card
      variant="raised"
      as="section"
      id="snabbfakta"
      aria-labelledby="snabbfakta-heading"
      className="flex flex-col gap-4 scroll-mt-24"
    >
      <h2 id="snabbfakta-heading" className="text-base font-semibold text-[var(--color-text)]">
        Snabböversikt
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-text-muted)]">Primär uppsägningskanal</span>
          <span className="font-semibold text-[var(--color-text)]">
            {channelText}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-text-muted)]">Uppsägningstid</span>
          <span className="font-semibold text-[var(--color-text)]">
            {noticeText}
          </span>
        </div>
      </div>
    </Card>
  );
}
