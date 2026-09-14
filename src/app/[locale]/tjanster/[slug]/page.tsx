import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getServiceRepository } from '@/features/services/repository';
import { ServiceGuideHeader } from '@/features/services/components/service-guide-header';
import { ServiceFacts } from '@/features/services/components/service-facts';
import { CancellationSteps } from '@/features/services/components/cancellation-steps';
import { OfficialCancellationAction } from '@/features/services/components/official-cancellation-action';
import { ServiceTermsSection } from '@/features/services/components/service-terms-section';
import { ServicePricesSection } from '@/features/services/components/service-prices-section';
import { SourceList } from '@/features/services/components/source-list';
import { ServiceToolsSection } from '@/features/services/components/service-tools-section';
import { ServiceInPageNav, InPageSection } from '@/features/services/components/service-in-page-nav';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';
import { getDataSourceMode } from '@/lib/env';
import { DatabaseUnconfiguredError } from '@/lib/errors';
import { BRAND } from '@/config/brand';
import { ArrowLeft } from 'lucide-react';

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const isFixtureMode = getDataSourceMode() === 'fixtures';

  let service: import('@/features/services/types').ServiceDetail | null = null;
  try {
    const repo = getServiceRepository();
    service = await repo.getServiceBySlug(slug);
  } catch (err) {
    if (err instanceof DatabaseUnconfiguredError) {
      return {
        title: `Tjänsten kunde inte hittas | ${BRAND.name}`,
      };
    }
    throw err;
  }

  if (!service) {
    return {
      title: `Tjänsten kunde inte hittas | ${BRAND.name}`,
    };
  }

  // Only published + verified PostgreSQL services are indexable
  const isIndexable =
    !isFixtureMode &&
    service.publicationStatus === 'published' &&
    service.verificationStatus === 'verified';

  return {
    title: `${service.name} — Säg upp abonnemang & villkor | ${BRAND.name}`,
    description: `Steg-för-steg-instruktioner, uppsägningstid och kontaktvägar för att avsluta ${service.name}.`,
    robots: {
      index: isIndexable,
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

  let service: import('@/features/services/types').ServiceDetail | null = null;
  try {
    const repo = getServiceRepository();
    service = await repo.getServiceBySlug(slug);
  } catch (err) {
    if (err instanceof DatabaseUnconfiguredError) {
      notFound();
    } else {
      throw err;
    }
  }

  if (!service) {
    notFound();
  }

  // Build in-page navigation sections dynamically based strictly on non-empty rendered sections
  const activeSections: InPageSection[] = [
    { id: 'snabbfakta', label: 'Snabböversikt' },
    { id: 'steg', label: 'Uppsägningssteg' },
  ];

  if (service.bindingNotes || service.confirmationNotes) {
    activeSections.push({ id: 'villkor', label: 'Villkor & bekräftelse' });
  }

  if (service.prices && service.prices.length > 0) {
    activeSections.push({ id: 'priser', label: 'Kända prisplaner' });
  }

  if (service.sources && service.sources.length > 0) {
    activeSections.push({ id: 'kallor', label: 'Källor & underlag' });
  }

  activeSections.push({ id: 'verktyg', label: 'Verktyg & sparande' });

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Contextual Back Navigation */}
      <nav aria-label="Tillbaka till sökning">
        <Link
          href="/sok"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-sm)] py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Tillbaka till sökning</span>
        </Link>
      </nav>

      {/* Main Grid with Content & Desktop In-Page Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 lg:gap-12 items-start">
        <article className="flex flex-col gap-10 min-w-0">
          {/* Guide Header */}
          <ServiceGuideHeader service={service} isFixtureMode={isFixtureMode} />

          {/* Quick Facts */}
          <ServiceFacts service={service} />

          {/* Official Cancellation Direct Action */}
          <OfficialCancellationAction
            serviceName={service.name}
            officialCancellationUrl={service.officialCancellationUrl}
            websiteUrl={service.websiteUrl}
          />

          {/* Cancellation Steps */}
          <CancellationSteps steps={service.steps} serviceName={service.name} />

          {/* Terms & Confirmation Section */}
          <ServiceTermsSection
            bindingNotes={service.bindingNotes}
            confirmationNotes={service.confirmationNotes}
          />

          {/* Known Prices */}
          <ServicePricesSection prices={service.prices} isFixtureMode={isFixtureMode} />

          {/* Sources */}
          <SourceList sources={service.sources} />

          {/* Related Tools */}
          <ServiceToolsSection serviceName={service.name} />

          {/* Contextual Summa Section */}
          <ContextualSummaCta context="service_detail" />

          {/* Editorial Disclaimer */}
          <footer className="border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-subtle)] leading-relaxed">
            <p className="font-semibold text-[var(--color-text-muted)] mb-1">
              Ansvarsbegränsning
            </p>
            <p>
              ByeScribe är en oberoende konsumentguide och har ingen koppling till leverantören. Uppsägningen sker alltid direkt mellan dig och leverantören enligt era avtalsvillkor.
            </p>
          </footer>
        </article>

        {/* In-Page Navigation (Desktop only, rendered if >= 3 sections) */}
        <aside className="hidden lg:block">
          <ServiceInPageNav sections={activeSections} />
        </aside>
      </div>
    </div>
  );
}
