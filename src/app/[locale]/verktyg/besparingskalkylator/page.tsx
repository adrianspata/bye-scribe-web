import React from 'react';
import type { Metadata } from 'next';
import { ToolPageHeader } from '@/features/tools/components/tool-page-header';
import { SavingsCalculator } from '@/features/savings-calculator/components/savings-calculator';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';

export const metadata: Metadata = {
  title: 'Subscription Savings Calculator',
  description:
    'Calculate how much money you save each month, year, and over 5 years by cancelling unused subscriptions.',
  alternates: {
    canonical: '/en/verktyg/besparingskalkylator',
  },
};

export default function SavingsCalculatorPage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto w-full">
      <ToolPageHeader
        category="Tools & Calculator"
        title="Savings Calculator"
        description="Enter what your subscription costs to see an estimate of your potential savings over one year and five years."
      />

      <SavingsCalculator />

      <ContextualSummaCta context="savings_calculator" />

      {/* Editorial Disclaimer */}
      <footer className="border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-subtle)] leading-relaxed">
        <p className="font-semibold text-[var(--color-text-muted)] mb-1">
          Disclaimer
        </p>
        <p>
          The savings calculator is an informational tool and calculations are based on constant prices and terms. ByeScribe does not manage payments or financial contracts.
        </p>
      </footer>
    </div>
  );
}
