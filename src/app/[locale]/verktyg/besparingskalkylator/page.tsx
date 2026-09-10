import React from 'react';
import type { Metadata } from 'next';
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
    <div className="flex flex-col gap-10 max-w-3xl">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
          Besparingskalkylator
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Många bäckar små blir snabbt tusentals kronor varje år. Fyll i vad ditt abonnemang kostar för att se din sammanlagda besparing om du avslutar det idag.
        </p>
      </header>

      <SavingsCalculator />

      <ContextualSummaCta context="savings_calculator" />
    </div>
  );
}
