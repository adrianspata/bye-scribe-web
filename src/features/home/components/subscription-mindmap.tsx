'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

interface SubscriptionNode {
  id: string;
  name: string;
  price: number; // in USD per month
  period: string;
  logoSrc: string;
  desktopStyle: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationClass: string;
  svgPath: string;
}

// 8 Subscriptions using exact logos from /public:
// 1. ChatGPT Plus (/chatgpt-logo.webp): $20.00/mo * 12 = $240.00/yr -> Total: $240.00
// 2. Spotify (/SpotifyLogo.webp): $11.99/mo * 12 = $143.88/yr -> Total: $383.88
// 3. iCloud+ (/icloud-logo.webp): $9.99/mo * 12 = $119.88/yr -> Total: $503.76
// 4. Netflix (/Netflix_logo.webp): $15.49/mo * 12 = $185.88/yr -> Total: $689.64
// 5. Disney+ (/disneyplusLogo.webp): $13.99/mo * 12 = $167.88/yr -> Total: $857.52
// 6. Slack Pro (/slack_logo.webp): $8.75/mo * 12 = $105.00/yr -> Total: $962.52
// 7. Notion Plus (/Notion-logo.webp): $10.00/mo * 12 = $120.00/yr -> Total: $1,082.52
// 8. Adobe Creative (/adobe-creative-logo.svg): $54.99/mo * 12 = $659.88/yr -> Total: $1,742.40

const SUBSCRIPTIONS: SubscriptionNode[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    price: 20.0,
    period: '/mo',
    logoSrc: '/chatgpt-logo.webp',
    desktopStyle: { top: '72%', left: '7%' },
    animationClass: 'animate-float-3',
    svgPath: 'M 225 422 C 265 422, 295 432, 340 435',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    price: 11.99,
    period: '/mo',
    logoSrc: '/SpotifyLogo.webp',
    desktopStyle: { top: '38%', left: '0%' },
    animationClass: 'animate-float-2',
    svgPath: 'M 150 235 C 220 270, 300 360, 390 395',
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    price: 9.99,
    period: '/mo',
    logoSrc: '/icloud-logo.webp',
    desktopStyle: { top: '20%', left: '22%' },
    animationClass: 'animate-float-1',
    svgPath: 'M 280 155 C 310 230, 400 320, 460 375',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    price: 15.49,
    period: '/mo',
    logoSrc: '/Netflix_logo.webp',
    desktopStyle: { top: '8%', left: '3%' },
    animationClass: 'animate-float-1',
    svgPath: 'M 120 85 C 160 210, 340 330, 430 375',
  },
  {
    id: 'disney',
    name: 'Disney+',
    price: 13.99,
    period: '/mo',
    logoSrc: '/disneyplusLogo.webp',
    desktopStyle: { top: '20%', right: '22%' },
    animationClass: 'animate-float-2',
    svgPath: 'M 720 155 C 690 230, 600 320, 540 375',
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    price: 8.75,
    period: '/mo',
    logoSrc: '/slack_logo.webp',
    desktopStyle: { top: '38%', right: '0%' },
    animationClass: 'animate-float-3',
    svgPath: 'M 850 235 C 780 270, 700 360, 610 395',
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    price: 10.0,
    period: '/mo',
    logoSrc: '/Notion-logo.webp',
    desktopStyle: { top: '72%', right: '7%' },
    animationClass: 'animate-float-1',
    svgPath: 'M 775 422 C 735 422, 705 432, 660 435',
  },
  {
    id: 'adobe',
    name: 'Adobe Creative',
    price: 54.99,
    period: '/mo',
    logoSrc: '/adobe-creative-logo.svg',
    desktopStyle: { top: '8%', right: '3%' },
    animationClass: 'animate-float-2',
    svgPath: 'M 880 85 C 840 210, 660 330, 570 375',
  },
];

const STEP_INTERVAL_MS = 850;
const PAUSE_AT_END_MS = 3200;

export function SubscriptionMindmap() {
  const t = useTranslations('home');

  // Exact step cumulative sums calculated by adding each subscription's yearly cost (price * 12)
  const cumulativeSteps = SUBSCRIPTIONS.reduce<number[]>((acc, sub, index) => {
    const annualCost = sub.price * 12;
    const prevSum = index > 0 ? acc[index - 1] : 0;
    acc.push(prevSum + annualCost);
    return acc;
  }, []);

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const isLastStep = stepIndex === cumulativeSteps.length - 1;
    const delay = isLastStep ? PAUSE_AT_END_MS : STEP_INTERVAL_MS;

    timeoutId = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % cumulativeSteps.length);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [stepIndex, cumulativeSteps.length]);

  const currentAnnualAmount = cumulativeSteps[stepIndex];
  const activeSub = SUBSCRIPTIONS[stepIndex];

  // Total baseline of all 8 subscriptions
  const fullMonthlyTotal = SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.price, 0);

  const formattedAccumulator = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(currentAnnualAmount);

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(fullMonthlyTotal);

  return (
    <section
      aria-labelledby="subscription-mindmap-heading"
      className="w-full flex flex-col gap-6 sm:gap-8 relative overflow-hidden rounded-[var(--radius-card-visual)] bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 lg:p-10 shadow-subtle"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-radial from-[var(--color-accent)]/5 via-transparent to-transparent pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      {/* Top Header & Intro */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto z-10">
        <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider">
          {t('mindmapBadge')}
        </span>
        <h2
          id="subscription-mindmap-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[var(--color-text)] leading-tight"
        >
          {t('mindmapHeading')}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-lg">
          {t('mindmapSubheading')}
        </p>
      </div>

      {/* Interactive Mindmap Visual Container (Desktop / Tablet Splines) */}
      <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[520px] mt-2 hidden md:block select-none">
        {/* SVG Curved Spline Rays */}
        <svg
          viewBox="0 0 1000 550"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="streamPulseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="1" />
            </linearGradient>
          </defs>

          {SUBSCRIPTIONS.map((sub, index) => {
            const isIncluded = index <= stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <g key={`path-${sub.id}`}>
                {/* Base static faint curve */}
                <path
                  d={sub.svgPath}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="1.5"
                  strokeOpacity={isIncluded ? 0.8 : 0.25}
                  className="transition-opacity duration-300"
                />
                {/* Energetic flowing pulse stream when active */}
                {isIncluded && (
                  <path
                    d={sub.svgPath}
                    fill="none"
                    stroke="url(#streamPulseGrad)"
                    strokeWidth={isCurrent ? '2.5' : '1.8'}
                    className={`animate-ray-flow ${isCurrent ? 'opacity-100' : 'opacity-60'} transition-opacity duration-300`}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Subscription Badges */}
        {SUBSCRIPTIONS.map((sub, index) => {
          const isIncluded = index <= stepIndex;
          const isCurrent = index === stepIndex;

          return (
            <div
              key={sub.id}
              style={sub.desktopStyle}
              className={`absolute z-10 ${sub.animationClass}`}
            >
              <div
                className={`flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-full transition-all duration-300 backdrop-blur-xs ${
                  isCurrent
                    ? 'bg-[var(--color-surface-raised)] border-2 border-[var(--color-accent)] shadow-lg scale-105 ring-2 ring-[var(--color-accent)]/20'
                    : isIncluded
                    ? 'bg-[var(--color-page)] border border-[var(--color-border-strong)] shadow-sm'
                    : 'bg-[var(--color-page)]/60 border border-[var(--color-border-subtle)] opacity-50 shadow-none'
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white dark:bg-zinc-900 border border-[var(--color-border-subtle)] p-1.5 shadow-xs">
                  <Image
                    src={sub.logoSrc}
                    alt={`${sub.name} logo`}
                    width={28}
                    height={28}
                    className="w-full h-full object-contain rounded-full"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-[var(--color-text)] leading-none">
                    {sub.name}
                  </span>
                  <span className="text-[11px] font-medium text-[var(--color-text-muted)] mt-0.5 tabular-nums">
                    ${sub.price.toFixed(2)}{sub.period}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Center Accumulator Focal Point Node */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="relative group bg-[var(--color-text)] text-[var(--color-page)] dark:bg-[var(--color-surface-raised)] dark:text-[var(--color-text)] border border-[var(--color-border-strong)] px-6 py-4 sm:px-8 sm:py-5 rounded-3xl shadow-xl flex flex-col items-center gap-2 min-w-[320px] text-center">
            {/* Subtle Top Indicator Pill with current added sub name */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-micro-pulse shrink-0" />
              <span>
                {stepIndex + 1} of {SUBSCRIPTIONS.length} subscriptions • +${(activeSub.price * 12).toFixed(2)}/yr ({activeSub.name})
              </span>
            </div>

            {/* Live Staged Counting Dollar Total */}
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums flex items-baseline gap-1">
              <span key={stepIndex} className="transition-all duration-300 animate-in fade-in">
                {formattedAccumulator}
              </span>
              <span className="text-xs font-normal opacity-75">/yr</span>
            </div>

            {/* Baseline Context */}
            <div className="text-xs opacity-75 flex items-center gap-2">
              <span>{t('mindmapMonthlyBaseline')}: <strong>{formattedMonthly}/mo</strong></span>
              <span>•</span>
              <span>8 subscriptions total</span>
            </div>

            {/* Link to Savings Calculator */}
            <Link
              href="/verktyg/besparingskalkylator"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-accent-soft)] hover:underline pt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
            >
              <span>{t('mindmapCta')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Stacked / Compact Layout (< 768px) */}
      <div className="flex md:hidden flex-col gap-5 z-10">
        {/* Grid of Subscription Badges */}
        <div className="grid grid-cols-2 gap-2.5">
          {SUBSCRIPTIONS.map((sub, index) => {
            const isIncluded = index <= stepIndex;
            const isCurrent = index === stepIndex;

            return (
              <div
                key={sub.id}
                className={`flex items-center gap-2 pl-2 pr-3 py-2 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[var(--color-surface-raised)] border-2 border-[var(--color-accent)] shadow-md'
                    : isIncluded
                    ? 'bg-[var(--color-page)] border border-[var(--color-border-strong)]'
                    : 'bg-[var(--color-page)]/60 border border-[var(--color-border-subtle)] opacity-50'
                }`}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white dark:bg-zinc-900 border border-[var(--color-border-subtle)] p-1 shadow-xs">
                  <Image
                    src={sub.logoSrc}
                    alt={`${sub.name} logo`}
                    width={24}
                    height={24}
                    className="w-full h-full object-contain rounded-full"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-text)] truncate">
                    {sub.name}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] tabular-nums">
                    ${sub.price.toFixed(2)}{sub.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Accumulator Card */}
        <div className="bg-[var(--color-text)] text-[var(--color-page)] dark:bg-[var(--color-surface-raised)] dark:text-[var(--color-text)] border border-[var(--color-border-strong)] p-5 rounded-2xl shadow-md flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-micro-pulse shrink-0" />
            <span>
              {stepIndex + 1}/8 • +${(activeSub.price * 12).toFixed(2)} ({activeSub.name})
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums">
            {formattedAccumulator}
            <span className="text-xs font-normal opacity-75 ml-1">/yr</span>
          </div>

          <div className="text-xs opacity-75">
            {t('mindmapMonthlyBaseline')}: <strong>{formattedMonthly}/mo</strong>
          </div>

          <Link
            href="/verktyg/besparingskalkylator"
            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent-soft)] hover:underline"
          >
            <span>{t('mindmapCta')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
