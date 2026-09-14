'use client';

import React, { useState } from 'react';
import { parseSEKToMinor, calculateSavings } from '@/lib/money';
import { FieldLabel, FieldHint } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InlineNotice } from '@/components/ui/inline-notice';
import { SavingsResult } from './savings-result';
import { Link } from '@/i18n/navigation';
import { ArrowRight, FileText, Search } from 'lucide-react';

export function SavingsCalculator() {
  const [costInput, setCostInput] = useState('149');
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  const amountMinor = parseSEKToMinor(costInput);
  const isInputEmpty = costInput.trim() === '';
  const isInvalid = !isInputEmpty && amountMinor === null;
  const isValid = amountMinor !== null && amountMinor > 0;

  const projection = isValid
    ? calculateSavings(amountMinor, interval)
    : { monthlyMinor: 0, yearlyMinor: 0, fiveYearMinor: 0 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Local calculation happens purely in React state during render
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Transparent Calculation Boundary Notice */}
      <InlineNotice variant="information" title="Beräkningsantagande">
        Beräkningen är en uppskattning baserad på beloppet du anger.
      </InlineNotice>

      <Card variant="raised" as="section" aria-labelledby="calc-form-heading" className="flex flex-col gap-6">
        <h2 id="calc-form-heading" className="text-base font-semibold text-[var(--color-text)]">
          1. Ange kostnad för abonnemanget
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Cost input */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="cost-input" required>
                Kostnad för abonnemanget (SEK)
              </FieldLabel>
              <div className="relative">
                <Input
                  id="cost-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  placeholder="T.ex. 149 eller 149,50"
                  aria-describedby={isInvalid ? 'cost-error' : 'cost-help'}
                  aria-invalid={isInvalid ? 'true' : 'false'}
                  hasError={isInvalid}
                  className="pr-12"
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-[var(--color-text-subtle)]"
                  aria-hidden="true"
                >
                  kr
                </span>
              </div>

              {isInvalid ? (
                <span id="cost-error" className="text-xs text-[var(--color-critical)] font-medium">
                  Ange ett giltigt positivt belopp i kronor (högst 2 decimaler, t.ex. 149 eller 149,90).
                </span>
              ) : (
                <FieldHint id="cost-help">
                  Ange belopp med punkt eller komma som decimaltecken.
                </FieldHint>
              )}
            </div>

            {/* Interval selector */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="interval-select">
                Faktureringsintervall
              </FieldLabel>
              <Select
                id="interval-select"
                value={interval}
                onChange={(e) => setInterval(e.target.value as 'month' | 'year')}
              >
                <option value="month">Per månad (månadsvis)</option>
                <option value="year">Per år (årsvis)</option>
              </Select>
              <FieldHint>
                Välj hur ofta du betalar för prenumerationen.
              </FieldHint>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="md">
              Beräkna besparing
            </Button>
          </div>
        </form>

        {/* Calculation Result */}
        {isValid && (
          <div className="border-t border-[var(--color-border)] pt-6">
            <SavingsResult projection={projection} />
          </div>
        )}
      </Card>

      {/* Next Steps Guidance */}
      <section aria-labelledby="calc-next-steps" className="border-t border-[var(--color-border)] pt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="calc-next-steps" className="text-base font-semibold text-[var(--color-text)]">
            Vad gör du nu?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Vill du avsluta ett abonnemang? Sök efter leverantörens uppsägningsguide eller skapa ett färdigt textutkast med vårt meddelandeverktyg.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/sok"
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)] transition-colors">
                  <Search className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Hitta uppsägningsguide
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Sök bland våra verifierade guider för att se uppsägningstid och rätt kontaktväg.
            </p>
          </Link>

          <Link
            href="/verktyg/uppsagningsmeddelande"
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-border-strong)] hover:shadow-raised transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-page-subtle)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)] transition-colors">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Skapa uppsägningsmeddelande
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Generera ett redigerbart textutkast för e-post eller brev helt lokalt i webbläsaren.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
