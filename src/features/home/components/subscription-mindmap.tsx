'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  side: 'left' | 'right' | 'top-left' | 'top-right';
  animationClass: string;
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
    desktopStyle: { top: '70%', left: '7%' },
    side: 'left',
    animationClass: 'animate-float-3',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    price: 11.99,
    period: '/mo',
    logoSrc: '/SpotifyLogo.webp',
    desktopStyle: { top: '38%', left: '1%' },
    side: 'left',
    animationClass: 'animate-float-2',
  },
  {
    id: 'icloud',
    name: 'iCloud+',
    price: 9.99,
    period: '/mo',
    logoSrc: '/icloud-logo.webp',
    desktopStyle: { top: '14%', left: '22%' },
    side: 'top-left',
    animationClass: 'animate-float-1',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    price: 15.49,
    period: '/mo',
    logoSrc: '/Netflix_logo.webp',
    desktopStyle: { top: '6%', left: '3%' },
    side: 'top-left',
    animationClass: 'animate-float-1',
  },
  {
    id: 'disney',
    name: 'Disney+',
    price: 13.99,
    period: '/mo',
    logoSrc: '/disneyplusLogo.webp',
    desktopStyle: { top: '14%', right: '22%' },
    side: 'top-right',
    animationClass: 'animate-float-2',
  },
  {
    id: 'slack',
    name: 'Slack Pro',
    price: 8.75,
    period: '/mo',
    logoSrc: '/slack_logo.webp',
    desktopStyle: { top: '38%', right: '1%' },
    side: 'right',
    animationClass: 'animate-float-3',
  },
  {
    id: 'notion',
    name: 'Notion Plus',
    price: 10.0,
    period: '/mo',
    logoSrc: '/Notion-logo.webp',
    desktopStyle: { top: '70%', right: '7%' },
    side: 'right',
    animationClass: 'animate-float-1',
  },
  {
    id: 'adobe',
    name: 'Adobe Creative',
    price: 54.99,
    period: '/mo',
    logoSrc: '/adobe-creative-logo.svg',
    desktopStyle: { top: '6%', right: '3%' },
    side: 'top-right',
    animationClass: 'animate-float-2',
  },
];

const STEP_INTERVAL_MS = 850;
const PAUSE_AT_END_MS = 3200;

export function SubscriptionMindmap() {
  const t = useTranslations('home');

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number }>({ width: 1000, height: 450 });
  const [computedPaths, setComputedPaths] = useState<Record<string, string>>({});

  // Recalculate exact spline paths whenever layout mounts or resizes
  const updateSplinePaths = useCallback(() => {
    if (!containerRef.current || !cardRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) return;

    setSvgDimensions({
      width: containerRect.width,
      height: containerRect.height,
    });

    const cardRelLeft = cardRect.left - containerRect.left;
    const cardRelTop = cardRect.top - containerRect.top;
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;

    const paths: Record<string, string> = {};

    SUBSCRIPTIONS.forEach((sub) => {
      const badgeEl = badgeRefs.current[sub.id];
      if (!badgeEl) return;

      const badgeRect = badgeEl.getBoundingClientRect();
      const badgeRelLeft = badgeRect.left - containerRect.left;
      const badgeRelTop = badgeRect.top - containerRect.top;
      const badgeWidth = badgeRect.width;
      const badgeHeight = badgeRect.height;

      let startX: number;
      let startY: number;
      let targetX: number;
      let targetY: number;
      let cp1X: number;
      let cp1Y: number;
      let cp2X: number;
      let cp2Y: number;

      if (sub.side === 'top-left') {
        startX = badgeRelLeft + badgeWidth * 0.55;
        startY = badgeRelTop + badgeHeight;
        targetX = cardRelLeft + (sub.id === 'netflix' ? cardWidth * 0.2 : cardWidth * 0.36);
        targetY = cardRelTop;
        cp1X = startX + (targetX - startX) * 0.15;
        cp1Y = startY + (targetY - startY) * 0.6;
        cp2X = startX + (targetX - startX) * 0.75;
        cp2Y = targetY - 10;
      } else if (sub.side === 'top-right') {
        startX = badgeRelLeft + badgeWidth * 0.45;
        startY = badgeRelTop + badgeHeight;
        targetX = cardRelLeft + (sub.id === 'adobe' ? cardWidth * 0.8 : cardWidth * 0.64);
        targetY = cardRelTop;
        cp1X = startX + (targetX - startX) * 0.15;
        cp1Y = startY + (targetY - startY) * 0.6;
        cp2X = startX + (targetX - startX) * 0.75;
        cp2Y = targetY - 10;
      } else if (sub.side === 'left') {
        startX = badgeRelLeft + badgeWidth;
        startY = badgeRelTop + badgeHeight / 2;
        targetX = cardRelLeft;
        targetY = sub.id === 'spotify' ? cardRelTop + cardHeight * 0.28 : cardRelTop + cardHeight * 0.68;
        const dx = targetX - startX;
        cp1X = startX + dx * 0.45;
        cp1Y = startY;
        cp2X = startX + dx * 0.8;
        cp2Y = targetY;
      } else {
        // right side
        startX = badgeRelLeft;
        startY = badgeRelTop + badgeHeight / 2;
        targetX = cardRelLeft + cardWidth;
        targetY = sub.id === 'slack' ? cardRelTop + cardHeight * 0.28 : cardRelTop + cardHeight * 0.68;
        const dx = targetX - startX;
        cp1X = startX + dx * 0.45;
        cp1Y = startY;
        cp2X = startX + dx * 0.8;
        cp2Y = targetY;
      }

      paths[sub.id] = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1X.toFixed(1)} ${cp1Y.toFixed(1)}, ${cp2X.toFixed(1)} ${cp2Y.toFixed(1)}, ${targetX.toFixed(1)} ${targetY.toFixed(1)}`;
    });

    setComputedPaths(paths);
  }, []);

  useEffect(() => {
    updateSplinePaths();

    const handleResize = () => {
      updateSplinePaths();
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateSplinePaths();
      });
      resizeObserver.observe(containerRef.current);
    }

    // Small delay to ensure all font / DOM layout elements have settled
    const timeout = setTimeout(updateSplinePaths, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(timeout);
    };
  }, [updateSplinePaths]);

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
      className="w-full max-h-[80vh] flex flex-col justify-between gap-3 sm:gap-5 relative overflow-hidden rounded-[var(--radius-card-visual)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4 sm:p-6 lg:p-7 shadow-subtle"
    >
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-radial from-[var(--color-accent)]/5 via-transparent to-transparent pointer-events-none blur-3xl"
        aria-hidden="true"
      />

      {/* Top Header & Intro */}
      <div className="flex flex-col items-center text-center gap-1.5 max-w-2xl mx-auto z-10 shrink-0">
        <h2
          id="subscription-mindmap-heading"
          className="text-xl sm:text-2xl lg:text-3xl font-normal tracking-tight text-[var(--color-text)] leading-tight"
        >
          {t('mindmapHeading')}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-lg">
          {t('mindmapSubheading')}
        </p>
      </div>

      {/* Interactive Mindmap Visual Container (Desktop / Tablet Splines) */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 min-h-[360px] max-h-[480px] hidden md:block select-none"
      >
        {/* SVG Curved Spline Rays */}
        <svg
          viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
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
            const d = computedPaths[sub.id];

            if (!d) return null;

            return (
              <g key={`path-${sub.id}`}>
                {/* Base static faint curve */}
                <path
                  d={d}
                  fill="none"
                  stroke="var(--color-border)"
                  strokeWidth="1.5"
                  strokeOpacity={isIncluded ? 0.8 : 0.25}
                  className="transition-opacity duration-300"
                />
                {/* Energetic flowing pulse stream when active */}
                {isIncluded && (
                  <path
                    d={d}
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
              ref={(el) => {
                badgeRefs.current[sub.id] = el;
              }}
              style={sub.desktopStyle}
              className={`absolute z-10 ${sub.animationClass}`}
            >
              <div
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-xs ${
                  isCurrent
                    ? 'bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] shadow-md scale-105'
                    : isIncluded
                      ? 'bg-[var(--color-page)] border border-[var(--color-border-strong)] shadow-xs'
                      : 'bg-[var(--color-page)]/60 border border-[var(--color-border-subtle)] opacity-50 shadow-none'
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
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <div
            ref={cardRef}
            style={{
              background:
                'radial-gradient(115% 95% at 50% -10%, #ff2585 0%, #ff4b98 28%, #fca5d2 56%, #e0e7ff 82%, #bfdbfe 100%)',
            }}
            className="relative group text-zinc-950 border border-white/70 shadow-[0_20px_45px_-10px_rgba(255,37,133,0.32),0_8px_20px_-6px_rgba(191,219,254,0.45),inset_0_1px_2px_0_rgba(255,255,255,0.9)] px-7 py-3 sm:px-8 sm:py-3.5 rounded-2xl flex flex-col items-center gap-0.5 min-w-[280px] sm:min-w-[320px] text-center before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/35 before:via-transparent before:to-white/20 before:pointer-events-none overflow-hidden"
          >
            {/* Live Staged Counting Dollar Total */}
            <div className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums flex items-baseline gap-1 text-zinc-950 relative z-10">
              <span key={stepIndex} className="transition-all duration-300 animate-in fade-in">
                {formattedAccumulator}
              </span>
              <span className="text-xs font-semibold text-zinc-900/80">/yr</span>
            </div>

            {/* Baseline Context */}
            <div className="text-xs text-zinc-900/85 font-medium flex items-center gap-2 relative z-10">
              <span>{t('mindmapMonthlyBaseline')}: <strong className="text-zinc-950 font-bold">{formattedMonthly}/mo</strong></span>
              <span>•</span>
              <span>8 subscriptions total</span>
            </div>
          </div>

          {/* Separate CTA Link below the badge */}
          <Link
            href="/verktyg/besparingskalkylator"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)] hover:text-[var(--color-text-muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            <span>{t('mindmapCta')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Mobile Stacked / Compact Layout (< 768px) */}
      <div className="flex md:hidden flex-col gap-4 z-10">
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
                    ? 'bg-[var(--color-surface-raised)] border border-[var(--color-border-strong)] shadow-md'
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

        {/* Mobile Accumulator Card (Gradient) & CTA Button */}
        <div className="flex flex-col items-center gap-2">
          <div
            style={{
              background:
                'radial-gradient(115% 95% at 50% -10%, #ff2585 0%, #ff4b98 28%, #fca5d2 56%, #e0e7ff 82%, #bfdbfe 100%)',
            }}
            className="w-full text-zinc-950 border border-white/70 shadow-[0_20px_45px_-10px_rgba(255,37,133,0.32),0_8px_20px_-6px_rgba(191,219,254,0.45),inset_0_1px_2px_0_rgba(255,255,255,0.9)] p-4 rounded-2xl flex flex-col items-center gap-0.5 text-center before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/35 before:via-transparent before:to-white/20 before:pointer-events-none relative overflow-hidden"
          >
            <div className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-zinc-950 relative z-10">
              {formattedAccumulator}
              <span className="text-xs font-semibold text-zinc-900/80 ml-1">/yr</span>
            </div>

            <div className="text-xs text-zinc-900/85 font-medium relative z-10">
              {t('mindmapMonthlyBaseline')}: <strong className="text-zinc-950 font-bold">{formattedMonthly}/mo</strong>
            </div>
          </div>

          <Link
            href="/verktyg/besparingskalkylator"
            className="group inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-text)] hover:text-[var(--color-text-muted)] transition-colors"
          >
            <span>{t('mindmapCta')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
