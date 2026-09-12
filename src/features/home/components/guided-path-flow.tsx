import React from 'react';
import { useTranslations } from 'next-intl';

export function GuidedPathFlow() {
  const t = useTranslations('home');

  const steps = [
    {
      num: 1,
      title: t('howStep1Title'),
      desc: t('howStep1Desc'),
    },
    {
      num: 2,
      title: t('howStep2Title'),
      desc: t('howStep2Desc'),
    },
    {
      num: 3,
      title: t('howStep3Title'),
      desc: t('howStep3Desc'),
    },
  ];

  return (
    <div className="w-full">
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 relative list-none p-0 m-0">
        {steps.map((step, idx) => (
          <li
            key={step.num}
            className="relative flex flex-col p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle transition-all"
          >
            {/* Functional Path Line on Desktop (decorative) */}
            {idx < steps.length - 1 && (
              <div
                className="hidden md:block absolute top-8 -right-3 w-6 h-[2px] bg-[var(--color-border-strong)] z-10"
                aria-hidden="true"
              />
            )}

            {/* Node and Step indicator */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-7 h-7 rounded-full bg-[var(--color-page-subtle)] border border-[var(--color-border-strong)] text-[var(--color-text)] flex items-center justify-center text-xs font-bold shrink-0"
                aria-hidden="true"
              >
                {step.num}
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)] tracking-tight">
                {step.title}
              </h3>
            </div>

            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {step.desc}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
