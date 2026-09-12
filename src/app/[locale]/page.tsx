import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SearchBar } from '@/features/search/components/search-bar';
import { FeaturedServices } from '@/features/services/components/featured-services';
import { GuidedPathFlow } from '@/features/home/components/guided-path-flow';
import { HeroPathMotif } from '@/features/home/components/hero-path-motif';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';
import { BRAND } from '@/config/brand';
import {
  Info,
  ArrowRight,
  Calculator,
  FileText,
  ListOrdered,
  CalendarClock,
  ExternalLink as ExternalLinkIcon,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.description,
    alternates: {
      canonical: '/sv',
    },
  };
}

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <div className="flex flex-col gap-10 sm:gap-14 lg:gap-18">
      {/* 1. Hero & Primary Search Section (Asymmetric Desktop Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center pt-2 sm:pt-4">
        {/* Left Column: Heading, Tagline, Search & Boundary Info */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[var(--color-text-muted)] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" aria-hidden="true" />
            <span>{BRAND.tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] text-[var(--color-text)] leading-[1.05]">
            {t('heroH1')}
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
            {t('heroSubtitle')}
          </p>

          {/* Primary Search Bar */}
          <div className="w-full mt-1">
            <SearchBar />
          </div>

          {/* Neutral Boundary Information Line */}
          <div className="flex items-start gap-2.5 text-xs text-[var(--color-text-muted)] py-1.5 border-l-2 border-[var(--color-border-strong)] pl-3 mt-1">
            <Info className="w-3.5 h-3.5 text-[var(--color-text-subtle)] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed">{t('heroDisclaimer')}</span>
          </div>
        </div>

        {/* Right Column: Functional Desktop Guided Clarity Motif */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-4">
          <HeroPathMotif />
        </div>
      </section>

      {/* 2. Value & Trust: Open Structural Strip */}
      <section
        aria-labelledby="value-heading"
        className="w-full border-y border-[var(--color-border)] py-6 sm:py-8"
      >
        <h2 id="value-heading" className="sr-only">
          Vad ByeScribe innehåller
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)] gap-6 md:gap-0">
          <div className="flex flex-col gap-2 md:px-6 first:md:pl-0">
            <div className="flex items-center gap-2 text-[var(--color-text)]">
              <ListOrdered className="w-4 h-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
              <h3 className="font-bold text-sm text-[var(--color-text)] tracking-tight">
                {t('valueStep1Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              {t('valueStep1Desc')}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4 md:pt-0 md:px-6">
            <div className="flex items-center gap-2 text-[var(--color-text)]">
              <CalendarClock className="w-4 h-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
              <h3 className="font-bold text-sm text-[var(--color-text)] tracking-tight">
                {t('valueStep2Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              {t('valueStep2Desc')}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4 md:pt-0 md:px-6 last:md:pr-0">
            <div className="flex items-center gap-2 text-[var(--color-text)]">
              <ExternalLinkIcon className="w-4 h-4 shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
              <h3 className="font-bold text-sm text-[var(--color-text)] tracking-tight">
                {t('valueStep3Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
              {t('valueStep3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Guided Clarity: How It Works */}
      <section aria-labelledby="how-it-works-heading" className="w-full flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            {t('howBadge')}
          </span>
          <h2
            id="how-it-works-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]"
          >
            {t('howHeading')}
          </h2>
        </div>
        <GuidedPathFlow />
      </section>

      {/* 4. Featured & Available Service Guides */}
      <FeaturedServices />

      {/* 5. Quick Tools Section */}
      <section aria-labelledby="tools-heading" className="w-full flex flex-col gap-4 sm:gap-6">
        <h2 id="tools-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text)]">
          {t('toolsHeading')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tool 1: Savings Calculator */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle flex flex-col justify-between gap-5 transition-all hover:border-[var(--color-border-strong)] hover:shadow-raised">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-text)] border border-[var(--color-border)]">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-[var(--color-text)]">
                  {t('calcTitle')}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {t('calcDesc')}
              </p>
            </div>
            <div>
              <Link
                href="/verktyg/besparingskalkylator"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
              >
                <span>{t('calcCta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Tool 2: Cancellation Message Draft */}
          <div className="p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle flex flex-col justify-between gap-5 transition-all hover:border-[var(--color-border-strong)] hover:shadow-raised">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-text)] border border-[var(--color-border)]">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-[var(--color-text)]">
                  {t('msgTitle')}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {t('msgDesc')}
              </p>
            </div>
            <div>
              <Link
                href="/verktyg/uppsagningsmeddelande"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
              >
                <span>{t('msgCta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contextual Summa Section */}
      <ContextualSummaCta context="homepage" />
    </div>
  );
}
