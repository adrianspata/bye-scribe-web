'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

interface SubscriptionNode {
  id: string;
  name: string;
  price: number; // in USD
  period: string;
  iconBg: string;
  desktopStyle: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationClass: string;
  // Specific SVG spline path connecting this badge directly to the center card
  svgPath: string;
  icon: React.ReactNode;
}

const COST_STEPS = [660, 799, 999, 1249, 1579, 1743];
const STEP_INTERVAL_MS = 750;
const PAUSE_AT_END_MS = 2600;

// SVG Coordinate Canvas: 1000 x 550
// Center card: centered at X: 500, top edge around Y: 370-380, width: ~380 (X: 310 to 690)
const SUBSCRIPTIONS: SubscriptionNode[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    price: 15.49,
    period: '/mo',
    iconBg: '#000000',
    desktopStyle: { top: '8%', left: '3%' },
    animationClass: 'animate-float-1',
    // Starts at bottom-right of Netflix badge (~120, 85) -> enters top-left of center card (430, 375)
    svgPath: 'M 120 85 C 160 210, 340 330, 430 375',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
        <path fill="#E50914" d="M5.5 2h3.2v20H5.5z" />
        <path fill="#E50914" d="M15.3 2h3.2v20h-3.2z" />
        <path fill="#B20710" d="M5.5 2l9.8 20h3.4L8.9 2z" />
      </svg>
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    price: 11.99,
    period: '/mo',
    iconBg: '#121212',
    desktopStyle: { top: '38%', left: '0%' },
    animationClass: 'animate-float-2',
    // Starts at right edge of Spotify badge (~150, 235) -> enters left-upper side of center card (390, 395)
    svgPath: 'M 150 235 C 220 270, 300 360, 390 395',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1DB954]" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.623.623 0 0 1-.858.207c-2.348-1.434-5.305-1.758-8.788-.962a.625.625 0 0 1-.277-1.22c3.809-.87 7.076-.499 9.716 1.117.31.189.408.59.207.858zm1.223-2.72c-.25.408-.784.536-1.192.285-2.688-1.652-6.785-2.131-9.965-1.166a.78.78 0 0 1-.986-.53.782.782 0 0 1 .53-.986c3.633-1.103 8.147-.57 11.228 1.32.408.25.536.784.285 1.192zm.106-2.833c-3.224-1.914-8.541-2.091-11.621-1.157a.936.936 0 0 1-1.168-.62.936.936 0 0 1 .62-1.168c3.535-1.073 9.403-.865 13.114 1.338a.936.936 0 0 1 .341 1.282.936.936 0 0 1-1.286.325z" />
      </svg>
    ),
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    price: 9.99,
    period: '/mo',
    iconBg: '#0070c9',
    desktopStyle: { top: '20%', left: '22%' },
    animationClass: 'animate-float-1',
    // Starts at bottom of iCloud badge (~280, 155) -> enters top-center-left of center card (460, 375)
    svgPath: 'M 280 155 C 310 230, 400 320, 460 375',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    ),
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Plus',
    price: 20.0,
    period: '/mo',
    iconBg: '#10a37f',
    desktopStyle: { top: '72%', left: '7%' },
    animationClass: 'animate-float-3',
    // Starts directly at right edge of ChatGPT badge (~225, 422) -> enters left edge of center card (340, 435)
    svgPath: 'M 225 422 C 265 422, 295 432, 340 435',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.08 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.493zm-9.22-4.28a4.48 4.48 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-5.7-.799zm-1.38-9.46a4.48 4.48 0 0 1 2.37-1.97v5.671a.79.79 0 0 0 .39.682l5.836 3.37-2.02 1.167a.076.076 0 0 1-.067 0l-4.839-2.793a4.494 4.494 0 0 1-1.67-6.127zm16.71 3.594l-5.84-3.37 2.02-1.166a.076.076 0 0 1 .068 0l4.839 2.793a4.5 4.5 0 0 1-.698 8.12v-5.696a.79.79 0 0 0-.389-.681zm2.01-3.012l-.142-.085-4.779-2.759a.776.776 0 0 0-.785 0L9.9 9.8lV7.466a.08.08 0 0 1 .033-.062L14.7 4.453a4.5 4.5 0 0 1 6.68 4.821zm-9.84-2.857a4.48 4.48 0 0 1 2.875 1.04l-.141.08-4.78 2.758a.795.795 0 0 0-.391.681v6.737L8.47 14.28a.071.071 0 0 1-.038-.052V8.645a4.504 4.504 0 0 1 4.494-4.493zm-3.04 7.608l2.92-1.685 2.92 1.685v3.37l-2.92 1.685-2.92-1.685z" />
      </svg>
    ),
  },
  {
    id: 'adobe',
    name: 'Adobe Creative',
    price: 54.99,
    period: '/mo',
    iconBg: '#DA1F26',
    desktopStyle: { top: '8%', right: '3%' },
    animationClass: 'animate-float-2',
    // Starts at bottom-left of Adobe badge (~880, 85) -> enters top-right of center card (570, 375)
    svgPath: 'M 880 85 C 840 210, 660 330, 570 375',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M13.96 3h6.04v18h-4.32l-3.23-7.77h-3.41L6.3 21H2V3h6.04l4.96 11.83L13.96 3z" />
      </svg>
    ),
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    price: 8.75,
    period: '/mo',
    iconBg: '#4A154B',
    desktopStyle: { top: '38%', right: '0%' },
    animationClass: 'animate-float-3',
    // Starts at left edge of Slack badge (~850, 235) -> enters right-upper side of center card (610, 395)
    svgPath: 'M 850 235 C 780 270, 700 360, 610 395',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
        <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
        <path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
        <path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" />
        <path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
  {
    id: 'disney',
    name: 'Disney+',
    price: 13.99,
    period: '/mo',
    iconBg: '#0F1A30',
    desktopStyle: { top: '20%', right: '22%' },
    animationClass: 'animate-float-2',
    // Starts at bottom of Disney badge (~720, 155) -> enters top-center-right of center card (540, 375)
    svgPath: 'M 720 155 C 690 230, 600 320, 540 375',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-4H7.5v-2H11v-4h2v4h3.5v2H13v4z" />
      </svg>
    ),
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    price: 10.0,
    period: '/mo',
    iconBg: '#000000',
    desktopStyle: { top: '72%', right: '7%' },
    animationClass: 'animate-float-1',
    // Starts directly at left edge of Notion badge (~775, 422) -> enters right edge of center card (660, 435)
    svgPath: 'M 775 422 C 735 422, 705 432, 660 435',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.442-.816c1.027-.07 1.493.42 1.283 1.423l-2.007 11.232c-.21 1.167-.77 1.493-1.89 1.563l-12.026.747c-1.12.07-1.494-.42-1.354-1.424l1.89-11.89c.14-1.004.56-1.54 1.234-1.301zm2.38 3.523l-1.33 8.353c-.093.583.187.817.793.77l9.73-.606c.607-.047.887-.397.98-.98l1.378-8.284c.093-.583-.163-.84-.77-.793l-9.986.723c-.607.047-.701.234-.794.817zm4.246 1.47l4.06-.28-.35 2.124-1.633.116-.677 4.2-1.517.094.677-4.2-1.493.117.933-2.17z" />
      </svg>
    ),
  },
];

export function SubscriptionMindmap() {
  const t = useTranslations('home');

  const monthlyTotal = SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.price, 0);

  // Staged counting animation: $660 -> $799 -> $999 -> $1,249 -> $1,579 -> $1,743 -> pause -> reset & repeat
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const isLastStep = stepIndex === COST_STEPS.length - 1;
    const delay = isLastStep ? PAUSE_AT_END_MS : STEP_INTERVAL_MS;

    timeoutId = setTimeout(() => {
      setStepIndex((prev) => (prev + 1) % COST_STEPS.length);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [stepIndex]);

  const currentAmount = COST_STEPS[stepIndex];

  const formattedAccumulator = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(currentAmount);

  const formattedMonthly = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(monthlyTotal);

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

          {SUBSCRIPTIONS.map((sub) => (
            <g key={`path-${sub.id}`}>
              {/* Base static faint curve */}
              <path
                d={sub.svgPath}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              {/* Animated energetic flowing pulse stream */}
              <path
                d={sub.svgPath}
                fill="none"
                stroke="url(#streamPulseGrad)"
                strokeWidth="2"
                className="animate-ray-flow opacity-70"
              />
            </g>
          ))}
        </svg>

        {/* Floating Subscription Badges */}
        {SUBSCRIPTIONS.map((sub) => (
          <div
            key={sub.id}
            style={sub.desktopStyle}
            className={`absolute z-10 ${sub.animationClass}`}
          >
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[var(--color-page)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] rounded-xl shadow-sm hover:shadow-md transition-all group backdrop-blur-xs">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: sub.iconBg }}
              >
                {sub.icon}
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
        ))}

        {/* Center Accumulator Focal Point Node */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="relative group bg-[var(--color-text)] text-[var(--color-page)] dark:bg-[var(--color-surface-raised)] dark:text-[var(--color-text)] border border-[var(--color-border-strong)] px-6 py-4 sm:px-8 sm:py-5 rounded-2xl shadow-xl flex flex-col items-center gap-2 min-w-[300px] text-center">
            {/* Subtle Top Indicator Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 dark:text-emerald-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-micro-pulse shrink-0" />
              <span>{t('mindmapLiveCounterLabel')}</span>
            </div>

            {/* Live Staged Counting Dollar Total */}
            <div className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums flex items-baseline gap-1 transition-transform duration-200">
              <span className="transition-all duration-300">{formattedAccumulator}</span>
              <span className="text-xs font-normal opacity-75">/yr</span>
            </div>

            {/* Baseline Context */}
            <div className="text-xs opacity-75 flex items-center gap-2">
              <span>{t('mindmapMonthlyBaseline')}: <strong>{formattedMonthly}/mo</strong></span>
              <span>•</span>
              <span>{t('mindmapActiveServices')}</span>
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
          {SUBSCRIPTIONS.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center gap-2 p-2.5 bg-[var(--color-page)] border border-[var(--color-border)] rounded-xl shadow-xs"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: sub.iconBg }}
              >
                {sub.icon}
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
          ))}
        </div>

        {/* Mobile Accumulator Card */}
        <div className="bg-[var(--color-text)] text-[var(--color-page)] dark:bg-[var(--color-surface-raised)] dark:text-[var(--color-text)] border border-[var(--color-border-strong)] p-5 rounded-2xl shadow-md flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-micro-pulse shrink-0" />
            <span>{t('mindmapLiveCounterLabel')}</span>
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
