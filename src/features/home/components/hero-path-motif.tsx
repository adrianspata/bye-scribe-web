import React from 'react';
import { Search, Compass, CheckCircle2 } from 'lucide-react';

export function HeroPathMotif() {
  const steps = [
    {
      icon: Search,
      label: 'Sök tjänsten',
      active: true,
    },
    {
      icon: Compass,
      label: 'Följ guiden',
      active: false,
    },
    {
      icon: CheckCircle2,
      label: 'Avsluta tjänsten',
      active: false,
    },
  ];

  return (
    <div
      className="hidden lg:flex flex-col justify-center p-6 lg:p-7 bg-[var(--color-page-subtle)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle relative overflow-hidden select-none"
      aria-hidden="true"
    >
      <div className="text-xs font-bold tracking-tight text-[var(--color-text-muted)] mb-5 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
        <span>Tre steg till avslut</span>
      </div>

      <div className="flex flex-col gap-5 relative">
        {/* Subtle connecting vertical path line */}
        <div className="absolute left-[17px] top-3.5 bottom-3.5 w-[2px] bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border-strong)] to-[var(--color-border)]" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="flex items-center gap-3.5 relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                  idx === 0
                    ? 'bg-[var(--color-accent)] text-[var(--color-accent-contrast)] ring-3 ring-[var(--color-accent-soft)]'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-muted)]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
