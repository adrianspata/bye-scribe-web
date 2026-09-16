import React from 'react';
import type { Metadata } from 'next';
import { ToolPageHeader } from '@/features/tools/components/tool-page-header';
import { CancellationMessageGenerator } from '@/features/cancellation-message/components/cancellation-message-generator';
import { ContextualSummaCta } from '@/features/summa-cta/components/contextual-summa-cta';

export const metadata: Metadata = {
  title: 'Create a Cancellation Message (Template & Draft)',
  description:
    'Create a safe, editable cancellation letter or email to end subscriptions. Completely local in your browser.',
  alternates: {
    canonical: '/en/verktyg/uppsagningsmeddelande',
  },
};

export default function CancellationMessagePage() {
  return (
    <div className="flex flex-col gap-10 max-w-3xl mx-auto w-full">
      <ToolPageHeader
        category="Tools & Template"
        title="Create a Cancellation Message"
        description="Fill in the details below to generate an editable text draft to send to the provider. Everything is created locally in your browser."
      />

      <CancellationMessageGenerator />

      <ContextualSummaCta context="cancellation_message" />

      {/* Editorial Disclaimer */}
      <footer className="border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-subtle)] leading-relaxed">
        <p className="font-semibold text-[var(--color-text-muted)] mb-1">
          Disclaimer
        </p>
        <p>
          The generated message is a suggestion and draft. ByeScribe is not a party to your contract and does not execute or monitor cancellations on your behalf.
        </p>
      </footer>
    </div>
  );
}
