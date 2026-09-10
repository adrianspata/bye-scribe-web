import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getServiceRepository } from '@/features/services/repository';
import { formatMoneySEK } from '@/lib/money';
import { formatSwedishDate } from '@/lib/dates';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ExternalLink } from '@/components/ui/external-link';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';
import { getDataSourceMode } from '@/lib/env';
import { BRAND } from '@/config/brand';
import { ArrowRight, Calculator, FileText } from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
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

const CHANNEL_LABELS: Record<string, string> = {
  website: 'Webbplats / Mina sidor',
  app: 'Mobilapplikation',
  email: 'E-post',
  phone: 'Telefon',
  postal_mail: 'Brev / Pappersblankett',
  in_person: 'På plats / Butik',
  reseller: 'Återförsäljare',
  multiple: 'Flera kontaktvägar',
  unknown: 'Ej specificerad',
};

const NOTICE_PERIOD_LABELS: Record<string, (val: number | null | undefined) => string> = {
  days: (val) => (val === 0 ? 'Ingen uppsägningstid (omedelbart)' : `${val} dagars uppsägningstid`),
  calendar_months: (val) => `${val || 1} kalendermånad(er)`,
  billing_cycles: (val) => `${val || 1} faktureringsperiod(er)`,
  unknown: () => 'Information saknas',
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const isFixtureMode = getDataSourceMode() === 'fixtures';

  const repo = getServiceRepository();
  const service = await repo.getServiceBySlug(slug);

  if (!service) {
    return {
      title: `Tjänsten kunde inte hittas | ${BRAND.name}`,
    };
  }

  return {
    title: `${service.name} — Säg upp abonnemang & villkor | ${BRAND.name}`,
    description: `Steg-för-steg-instruktioner, uppsägningstid och kontaktvägar för att avsluta ${service.name}.`,
    robots: {
      index: !isFixtureMode,
      follow: !isFixtureMode,
    },
    alternates: {
      canonical: `/sv/tjanster/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const isFixtureMode = getDataSourceMode() === 'fixtures';

  const repo = getServiceRepository();
  const service = await repo.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const noticePeriodText =
    NOTICE_PERIOD_LABELS[service.noticePeriodUnit]?.(service.noticePeriodValue) ||
    'Information saknas';

  return (
    <article className="flex flex-col gap-10 max-w-3xl">
      {/* Service Header */}
      <header className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {service.category.name}
            </span>
            {isFixtureMode && (
              <Badge variant="warning">Lokal demo</Badge>
            )}
          </div>
          {service.lastVerifiedAt && (
            <span className="text-xs text-[var(--color-text-subtle)]">
              Verifierad {formatSwedishDate(service.lastVerifiedAt, 'long')}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
          Säg upp {service.name}
        </h1>

        {service.summary && (
          <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
            {service.summary}
          </p>
        )}

        {service.legalName && (
          <p className="text-xs text-[var(--color-text-subtle)]">
            Juridiskt bolagsnamn: {service.legalName}
          </p>
        )}
      </header>

      {/* Key Terms Overview Card */}
      <Card variant="raised" as="section" aria-labelledby="terms-heading" className="flex flex-col gap-5">
        <h2 id="terms-heading" className="text-base font-semibold text-[var(--color-text)]">
          Översikt & Uppsägningsvillkor
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-text-muted)]">Primär uppsägningskanal</span>
            <span className="font-semibold text-[var(--color-text)]">
              {CHANNEL_LABELS[service.cancellationChannel] || service.cancellationChannel}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-text-muted)]">Uppsägningstid</span>
            <span className="font-semibold text-[var(--color-text)]">
              {noticePeriodText}
            </span>
          </div>

          {service.bindingNotes && (
            <div className="flex flex-col gap-1 sm:col-span-2 border-t border-[var(--color-border)] pt-3">
              <span className="text-xs text-[var(--color-text-muted)]">Bindningstid & villkor</span>
              <span className="text-[var(--color-text)] leading-relaxed">
                {service.bindingNotes}
              </span>
            </div>
          )}

          {service.confirmationNotes && (
            <div className="flex flex-col gap-1 sm:col-span-2 border-t border-[var(--color-border)] pt-3">
              <span className="text-xs text-[var(--color-text-muted)]">Bekräftelse på uppsägning</span>
              <span className="text-[var(--color-text)] leading-relaxed">
                {service.confirmationNotes}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Step-by-Step Cancellation Guide (Guided Clarity motif) */}
      <section aria-labelledby="steps-heading" className="flex flex-col gap-6">
        <h2 id="steps-heading" className="text-xl font-bold tracking-tight text-[var(--color-text)]">
          Steg för att avsluta {service.name}
        </h2>

        {service.steps.length > 0 ? (
          <ol className="flex flex-col gap-4 list-none p-0 m-0">
            {service.steps.map((step) => (
              <li
                key={step.id}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 flex gap-4 shadow-subtle relative"
              >
                <span className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-bold text-sm flex items-center justify-center shrink-0 border border-[var(--color-accent)]/20">
                  {step.position}
                </span>
                <div className="flex flex-col gap-1.5 flex-1">
                  <h3 className="font-semibold text-base text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
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
            ))}
          </ol>
        ) : (
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-sm text-[var(--color-text-muted)]">
            Inga detaljerade steg publicerade för denna tjänst ännu.
          </div>
        )}
      </section>

      {/* Official Cancellation Link (External with Safety Disclaimer) */}
      {service.officialCancellationUrl && isValidExternalUrl(service.officialCancellationUrl) && (
        <Card variant="raised" as="section" aria-labelledby="official-link-heading" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 id="official-link-heading" className="text-sm font-semibold text-[var(--color-text)]">
              Officiell uppsägningssida hos {service.name}
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Länken leder direkt till tjänsteleverantörens egen inloggning eller supportsida.
            </p>
          </div>
          <a
            href={service.officialCancellationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
          >
            Öppna {service.name} (extern länk)
          </a>
        </Card>
      )}

      {/* Price Plans & Savings Helper */}
      {service.prices.length > 0 && (
        <section aria-labelledby="prices-heading" className="flex flex-col gap-3">
          <h2 id="prices-heading" className="text-base font-semibold text-[var(--color-text)]">
            Kända prisplaner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.prices.map((price) => (
              <div
                key={price.id}
                className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex items-center justify-between shadow-xs"
              >
                <span className="font-medium text-sm text-[var(--color-text)]">
                  {price.planName}
                </span>
                <span className="text-sm font-bold text-[var(--color-text)] tabular-nums">
                  {formatMoneySEK(price.amountMinor, { inMinor: true, interval: price.billingInterval === 'monthly' ? 'month' : undefined })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Action Tools Link */}
      <section aria-labelledby="action-tools-heading" className="border-t border-[var(--color-border)] pt-6 flex flex-col gap-4">
        <h2 id="action-tools-heading" className="text-base font-semibold text-[var(--color-text)]">
          Verktyg för {service.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/verktyg/uppsagningsmeddelande?service=${encodeURIComponent(service.name)}`}
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)] transition-colors">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Skapa uppsägningsmeddelande
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              Generera ett färdigt textutkast med {service.name} förifyllt.
            </span>
          </Link>

          <Link
            href="/verktyg/besparingskalkylator"
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)] transition-colors">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Räkna på besparingen
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              Se hur mycket du sparar på 1 år och 5 år om du avslutar prenumerationen.
            </span>
          </Link>
        </div>
      </section>

      {/* Contextual Summa CTA */}
      <ContextualSummaCta context="service_detail" />
    </article>
  );
}
