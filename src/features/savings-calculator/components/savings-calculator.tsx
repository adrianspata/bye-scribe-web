'use client';

import React, { useState } from 'react';
import { parseSEKToMinor, calculateSavings, formatMoneySEK } from '@/lib/money';
import { FieldLabel, FieldHint } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export function SavingsCalculator() {
  const [costInput, setCostInput] = useState('149');
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  const amountMinor = parseSEKToMinor(costInput);
  const isValid = amountMinor !== null && amountMinor > 0;
  const projection = isValid
    ? calculateSavings(amountMinor, interval)
    : { monthlyMinor: 0, yearlyMinor: 0, fiveYearMinor: 0 };

  return (
    <div className="flex flex-col gap-8">
      <Card variant="raised" className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Cost input */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="cost-input">
              Kostnad för abonnemanget (SEK)
            </FieldLabel>
            <Input
              id="cost-input"
              type="text"
              inputMode="decimal"
              value={costInput}
              onChange={(e) => setCostInput(e.target.value)}
              placeholder="T.ex. 149 eller 149,50"
              aria-describedby="cost-help"
              hasError={!isValid && costInput.trim() !== ''}
            />
            <FieldHint id="cost-help">
              Ange belopp med punkt eller komma (t.ex. 149 eller 149,00).
            </FieldHint>
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
          </div>
        </div>

        {/* Calculation Results Card */}
        {isValid ? (
          <div
            aria-live="polite"
            className="border-t border-[var(--color-border)] pt-6 flex flex-col gap-4"
          >
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Beräknad besparing om du avslutar tjänsten
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--color-page)] border border-[var(--color-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
                <span className="text-xs text-[var(--color-text-muted)]">Månadskostnad</span>
                <span className="text-xl font-bold text-[var(--color-text)] tabular-nums">
                  {formatMoneySEK(projection.monthlyMinor, { inMinor: true, interval: 'month' })}
                </span>
              </div>

              <div className="p-4 bg-[var(--color-positive-surface)] border border-[var(--color-positive-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
                <span className="text-xs text-[var(--color-positive)] font-medium">Besparing 1 år</span>
                <span className="text-xl font-bold text-[var(--color-positive)] tabular-nums">
                  {formatMoneySEK(projection.yearlyMinor, { inMinor: true })}
                </span>
              </div>

              <div className="p-4 bg-[var(--color-positive-surface)] border border-[var(--color-positive-border)] rounded-[var(--radius-md)] flex flex-col gap-1 shadow-xs">
                <span className="text-xs text-[var(--color-positive)] font-medium">Besparing 5 år</span>
                <span className="text-xl font-bold text-[var(--color-positive)] tabular-nums">
                  {formatMoneySEK(projection.fiveYearMinor, { inMinor: true })}
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--color-text-subtle)]">
              Beräkningen baseras på oförändrat pris och avser potentiell besparing, inte ett garanterat resultat.
            </p>
          </div>
        ) : (
          <div className="border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-critical)] font-medium">
            Vänligen ange ett giltigt positivt belopp.
          </div>
        )}
      </Card>
    </div>
  );
}
