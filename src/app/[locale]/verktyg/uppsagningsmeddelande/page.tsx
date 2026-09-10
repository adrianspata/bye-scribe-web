import React from 'react';
import type { Metadata } from 'next';
import { CancellationMessageGenerator } from '@/features/cancellation-message/components/cancellation-message-generator';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';

export const metadata: Metadata = {
  title: 'Skapa uppsägningsmeddelande (Mall & Utkast)',
  description:
    'Skapa ett säkert, anpassat uppsägningsbrev eller e-postmeddelande för att avsluta abonnemang. Helt lokalt i din webbläsare.',
  alternates: {
    canonical: '/sv/verktyg/uppsagningsmeddelande',
  },
};

export default function CancellationMessagePage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text)]">
          Skapa uppsägningsmeddelande
        </h1>
        <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
          Generera en tydlig text att skicka via e-post eller brev till tjänsten du vill avsluta. Texten förbereds helt lokalt i din webbläsare och skickas aldrig över nätverket.
        </p>
      </header>

      <CancellationMessageGenerator />

      <ContextualSummaCta context="cancellation_message" />
    </div>
  );
}
