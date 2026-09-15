import React from 'react';
import type { Metadata } from 'next';
import { ToolPageHeader } from '@/features/tools/components/tool-page-header';
import { SavingsCalculator } from '@/features/savings-calculator/components/savings-calculator';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';

export const metadata: Metadata = {
  title: 'Besparingskalkylator för abonnemang',
  description:
    'Räkna ut hur mycket pengar du sparar varje månad, år och på 5 år genom att säga upp oanvända prenumerationer och abonnemang.',
  alternates: {
    canonical: '/sv/verktyg/besparingskalkylator',
  },
};

export default function SavingsCalculatorPage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto w-full">
      <ToolPageHeader
        category="Verktyg och kalkylator"
        title="Besparingskalkylator för abonnemang"
        description="Fyll i vad ditt abonnemang kostar för att se en uppskattning av din potentiella besparing på ett år och fem år."
      />

      <SavingsCalculator />

      <ContextualSummaCta context="savings_calculator" />

      {/* Editorial Disclaimer */}
      <footer className="border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-subtle)] leading-relaxed">
        <p className="font-semibold text-[var(--color-text-muted)] mb-1">
          Ansvarsbegränsning
        </p>
        <p>
          Besparingskalkylatorn är ett informationsverktyg och beräkningarna baseras på oförändrade priser och villkor. ByeScribe hanterar inga betalningar eller finansiella avtal.
        </p>
      </footer>
    </div>
  );
}
