import React from 'react';
import type { Metadata } from 'next';
import { ToolPageHeader } from '@/features/tools/components/tool-page-header';
import { CancellationMessageGenerator } from '@/features/cancellation-message/components/cancellation-message-generator';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';

export const metadata: Metadata = {
  title: 'Skapa uppsägningsmeddelande (Mall & Utkast)',
  description:
    'Skapa ett säkert, redigerbart uppsägningsbrev eller e-postmeddelande för att avsluta abonnemang. Helt lokalt i din webbläsare.',
  alternates: {
    canonical: '/sv/verktyg/uppsagningsmeddelande',
  },
};

export default function CancellationMessagePage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl">
      <ToolPageHeader
        category="Verktyg & mallar"
        title="Skapa uppsägningsmeddelande"
        description="Generera ett redigerbart textutkast att skicka via e-post, kontaktformulär eller brev till tjänsten du vill avsluta. Texten skapas helt lokalt i din webbläsare och skickas aldrig till ByeScribe."
      />

      <CancellationMessageGenerator />

      <ContextualSummaCta context="cancellation_message" />

      {/* Editorial Disclaimer */}
      <footer className="border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-subtle)] leading-relaxed">
        <p className="font-semibold text-[var(--color-text-muted)] mb-1">
          Ansvarsbegränsning
        </p>
        <p>
          Det genererade meddelandet är ett förslag och utkast. ByeScribe är inte part i ditt avtal och genomför eller bevakar inte uppsägningen åt dig.
        </p>
      </footer>
    </div>
  );
}
