import React from 'react';
import { useTranslations } from 'next-intl';
import { SignalField, SignalFieldVariant } from '@/components/visual/signal-field';

export function GuidedPathFlow() {
  const t = useTranslations('home');

  const steps: Array<{
    num: number;
    title: string;
    desc: string;
    variant: SignalFieldVariant;
    imageSrc: string;
  }> = [
      {
        num: 1,
        title: t('howStep1Title'),
        desc: t('howStep1Desc'),
        variant: 'guidance',
        imageSrc: '/grad13.webp',
      },
      {
        num: 2,
        title: t('howStep2Title'),
        desc: t('howStep2Desc'),
        variant: 'release',
        imageSrc: '/grad9.webp',
      },
      {
        num: 3,
        title: t('howStep3Title'),
        desc: t('howStep3Desc'),
        variant: 'completion',
        imageSrc: '/grad18.webp',
      },
    ];

  return (
    <div className="w-full">
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative list-none p-0 m-0">
        {steps.map((step) => (
          <li
            key={step.num}
            className="group relative flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] overflow-hidden shadow-subtle hover:border-[var(--color-border-strong)] transition-all"
          >
            {/* 1. Grainy Gradient Visual Surface */}
            <SignalField
              imageSrc={step.imageSrc}
              variant={step.variant}
              className="aspect-[16/9] w-full p-4 sm:p-5 flex items-end justify-between border-b border-[var(--color-border-subtle)]"
            >
              {/* Svartvit nummercirkel 40x40px (tabular-nums, hög kontrast) */}
              <div
                className="w-10 h-10 rounded-full bg-[var(--color-text)] text-[var(--color-page)] flex items-center justify-center font-bold text-sm tabular-nums shadow-xs shrink-0 select-none"
                aria-hidden="true"
              >
                {step.num}
              </div>
            </SignalField>

            {/* 2. Separat neutral informationsyta */}
            <div className="p-5 sm:p-6 bg-[var(--color-surface)] flex flex-col gap-1.5 flex-1 text-left">
              <h3 className="text-base font-normal text-[var(--color-text)] tracking-tight">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
