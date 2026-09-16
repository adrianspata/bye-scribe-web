import React from 'react';
import { Search, Compass, CheckCircle2 } from 'lucide-react';
import { SignalField } from '@/components/visual/signal-field';

export function HeroPathMotif() {
  const steps = [
    {
      icon: Search,
      label: 'Search service',
      active: true,
    },
    {
      icon: Compass,
      label: 'Follow guide',
      active: false,
    },
    {
      icon: CheckCircle2,
      label: 'Cancel direct',
      active: false,
    },
  ];

  return (
    <div
      className="hidden lg:block relative border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle overflow-hidden select-none bg-[var(--color-page-subtle)]"
      aria-hidden="true"
    >
      <SignalField variant="path" ambientMotion={true} className="p-6 lg:p-7">
        <div className="text-xs font-semibold tracking-tight text-[var(--color-text-muted)] mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          <span>How it works</span>
        </div>

        <div className="flex flex-col gap-5 relative">
          {/* Connecting vertical path line with crisp gradient */}
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
      </SignalField>
    </div>
  );
}
