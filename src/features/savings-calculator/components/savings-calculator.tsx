'use client';

import React, { useState } from 'react';
import {
  CurrencyCode,
  SUPPORTED_CURRENCIES,
  parseAmountToMinor,
  calculateSavings,
} from '@/lib/money';
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
  const [currency, setCurrency] = useState<CurrencyCode>('SEK');
  const [interval, setInterval] = useState<'month' | 'year'>('month');

  const amountMinor = parseAmountToMinor(costInput);
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
      <InlineNotice variant="information" title="Calculation Assumption">
        This calculation is an estimate based on the amount and currency you provide.
      </InlineNotice>

      <Card variant="raised" as="section" aria-labelledby="calc-form-heading" className="flex flex-col gap-6">
        <h2 id="calc-form-heading" className="text-base font-normal text-[var(--color-text)]">
          1. Enter subscription cost & currency
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Cost input */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="cost-input" required>
                Subscription cost
              </FieldLabel>
              <div className="relative">
                <Input
                  id="cost-input"
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                  placeholder="e.g. 149 or 149.50"
                  aria-describedby={isInvalid ? 'cost-error' : 'cost-help'}
                  aria-invalid={isInvalid ? 'true' : 'false'}
                  hasError={isInvalid}
                  className="pr-14"
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-[var(--color-text-subtle)]"
                  aria-hidden="true"
                >
                  {currency}
                </span>
              </div>

              {isInvalid ? (
                <span id="cost-error" className="text-xs text-[var(--color-critical)] font-medium">
                  Please enter a valid positive amount (up to 2 decimal places).
                </span>
              ) : (
                <FieldHint id="cost-help">
                  Enter amount with dot or comma as decimal separator.
                </FieldHint>
              )}
            </div>

            {/* Currency selector */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="currency-select">
                Currency
              </FieldLabel>
              <Select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} – {c.name}
                  </option>
                ))}
              </Select>
              <FieldHint>
                Select your preferred currency.
              </FieldHint>
            </div>

            {/* Interval selector */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="interval-select">
                Billing interval
              </FieldLabel>
              <Select
                id="interval-select"
                value={interval}
                onChange={(e) => setInterval(e.target.value as 'month' | 'year')}
              >
                <option value="month">Monthly (per month)</option>
                <option value="year">Yearly (per year)</option>
              </Select>
              <FieldHint>
                Select how often you pay for the subscription.
              </FieldHint>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" size="md">
              Calculate savings
            </Button>
          </div>
        </form>

        {/* Calculation Result */}
        {isValid && (
          <div className="border-t border-[var(--color-border)] pt-6">
            <SavingsResult projection={projection} currency={currency} />
          </div>
        )}
      </Card>

      {/* Next Steps Guidance */}
      <section aria-labelledby="next-steps-heading" className="border-t border-[var(--color-border)] pt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="next-steps-heading" className="text-base font-normal text-[var(--color-text)]">
            What&apos;s next?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Ready to cancel? Search for the provider&apos;s cancellation guide or create a cancellation letter with our message tool.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/sok"
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] hover:border-[var(--color-border-strong)] hover:shadow-subtle transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-page-subtle)] text-[#0284c7] dark:text-[#38bdf8]">
                  <Search className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Find cancellation guide
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Search verified guides to see notice periods and official contact paths.
            </p>
          </Link>

          <Link
            href="/verktyg/uppsagningsmeddelande"
            className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] hover:border-[var(--color-border-strong)] hover:shadow-subtle transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-page-subtle)] text-[#7c3aed] dark:text-[#a78bfa]">
                  <FileText className="w-4 h-4" aria-hidden="true" />
                </div>
                <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  Create cancellation message
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Generate an editable text draft for email or letter locally in your browser.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
