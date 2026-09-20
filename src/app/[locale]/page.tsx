import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SearchBar } from '@/features/search/components/search-bar';
import { FeaturedServices } from '@/features/services/components/featured-services';
import { GuidedPathFlow } from '@/features/home/components/guided-path-flow';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';
import { SubscriptionMindmap } from '@/features/home/components/subscription-mindmap';
import { BRAND } from '@/config/brand';
import { SignalField } from '@/components/visual/signal-field';
import { TypingSectionHeading } from '@/components/ui/typing-section-heading';
import {
  Info,
  ArrowRight,
  Calculator,
  FileText,
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
    <div className="flex flex-col gap-12 sm:gap-16 lg:gap-20">
      {/* 1. Centered Hero & Primary Search Section */}
      <section className="flex flex-col items-center text-center gap-4 sm:gap-5 pt-4 sm:pt-8 max-w-3xl mx-auto w-full">
        {/* Low-key Brand Tagline (hidden on smallest screens to prioritize task) */}
        <div className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0 animate-micro-pulse" aria-hidden="true" />
          <span>{BRAND.tagline}</span>
        </div>

        {/* Static H1 Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] text-[var(--color-text)] leading-[1.1] max-w-2xl text-center">
          {t('heroH1')}
        </h1>

        {/* Ingress */}
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl">
          {t('heroSubtitle')}
        </p>

        {/* Primary Search Bar */}
        <div className="w-full mt-2 flex justify-center">
          <SearchBar />
        </div>

        {/* Two Discrete Internal Tool Links */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs sm:text-sm font-medium text-[var(--color-text-muted)] mt-1">
          <Link
            href="/verktyg/uppsagningsmeddelande"
            className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm py-0.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#7c3aed] dark:text-[#a78bfa] shrink-0" aria-hidden="true" />
            <span>{t('heroToolDraftLink')}</span>
          </Link>
          <span className="text-[var(--color-border-strong)] hidden sm:inline" aria-hidden="true">
            •
          </span>
          <Link
            href="/verktyg/besparingskalkylator"
            className="inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm py-0.5"
          >
            <Calculator className="w-3.5 h-3.5 text-[#0d9488] dark:text-[#2dd4bf] shrink-0" aria-hidden="true" />
            <span>{t('heroToolCalcLink')}</span>
          </Link>
        </div>

        {/* Neutral Limitation Line */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-subtle)] mt-1">
          <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{t('heroDisclaimer')}</span>
        </div>
      </section>

      {/* 2. Available Service Guides */}
      <FeaturedServices />

      {/* 3. Quick Tools Section */}
      <section aria-labelledby="tools-heading" className="w-full flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1">
          <TypingSectionHeading
            id="tools-heading"
            text={t('toolsHeading')}
            className="text-lg sm:text-xl font-normal tracking-tight text-[var(--color-text)]"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Tool 1: Savings Calculator */}
          <Link
            href="/verktyg/besparingskalkylator"
            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] overflow-hidden shadow-subtle hover:border-[var(--color-border-strong)] transition-all flex flex-col focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            {/* Grainy Gradient Visual Surface (Savings Calculator) */}
            <SignalField imageSrc="/grad11.webp" variant="guidance" className="aspect-[16/9] w-full p-4 sm:p-5 flex items-end justify-between border-b border-[var(--color-border-subtle)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-text)] text-[var(--color-page)] flex items-center justify-center font-bold text-sm shadow-xs shrink-0 select-none" aria-hidden="true">
                <Calculator className="w-5 h-5 text-[#2dd4bf] dark:text-[#0d9488]" />
              </div>
            </SignalField>

            <div className="p-5 sm:p-6 bg-[var(--color-surface)] flex flex-col justify-between gap-4 flex-1 text-left">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-normal text-base text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {t('calcTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t('calcDesc')}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors pt-1">
                <span>{t('calcCta')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>

          {/* Tool 2: Cancellation Message Draft */}
          <Link
            href="/verktyg/uppsagningsmeddelande"
            className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] overflow-hidden shadow-subtle hover:border-[var(--color-border-strong)] transition-all flex flex-col focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            {/* Grainy Gradient Visual Surface (Message Draft) */}
            <SignalField imageSrc="/grad16.webp" variant="release" className="aspect-[16/9] w-full p-4 sm:p-5 flex items-end justify-between border-b border-[var(--color-border-subtle)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-text)] text-[var(--color-page)] flex items-center justify-center font-bold text-sm shadow-xs shrink-0 select-none" aria-hidden="true">
                <FileText className="w-5 h-5 text-[#a78bfa] dark:text-[#7c3aed]" />
              </div>
            </SignalField>

            <div className="p-5 sm:p-6 bg-[var(--color-surface)] flex flex-col justify-between gap-4 flex-1 text-left">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-normal text-base text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {t('msgTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t('msgDesc')}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors pt-1">
                <span>{t('msgCta')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Guided Clarity: 3-Step Flow */}
      <section aria-labelledby="how-it-works-heading" className="w-full flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-[var(--color-text-subtle)]">
            {t('howBadge')}
          </span>
          <TypingSectionHeading
            id="how-it-works-heading"
            text={t('howHeading')}
            className="text-lg sm:text-xl font-normal tracking-tight text-[var(--color-text)]"
          />
        </div>
        <GuidedPathFlow />
      </section>

      {/* 5. Subscription Accumulator Mindmap Section */}
      <SubscriptionMindmap />

      {/* 6. Contextual Summa Section */}
      <ContextualSummaCta context="homepage" />
    </div>
  );
}
