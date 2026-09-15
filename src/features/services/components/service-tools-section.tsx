import React from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Calculator, FileText } from 'lucide-react';

export interface ServiceToolsSectionProps {
  serviceName: string;
}

export function ServiceToolsSection({ serviceName }: ServiceToolsSectionProps) {
  const sanitizedServiceName = serviceName.trim().slice(0, 100);

  return (
    <section id="verktyg" aria-labelledby="verktyg-heading" className="border-t border-[var(--color-border)] pt-8 flex flex-col gap-4 scroll-mt-24">
      <div className="flex flex-col gap-1 text-left">
        <h2 id="verktyg-heading" className="text-base font-normal text-[var(--color-text)]">
          Verktyg för {serviceName}
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          Använd våra kostnadsfria verktyg för att underlätta uppsägningen och räkna på dina besparingar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/verktyg/uppsagningsmeddelande?service=${encodeURIComponent(sanitizedServiceName)}`}
          className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] hover:border-[var(--color-border-strong)] hover:shadow-subtle transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-page-subtle)] text-[#7c3aed] dark:text-[#a78bfa]">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                Skapa uppsägningsmeddelande
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Generera ett färdigt textutkast med {serviceName} förifyllt för e-post eller brev.
          </p>
        </Link>

        <Link
          href="/verktyg/besparingskalkylator"
          className="group p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card-visual)] hover:border-[var(--color-border-strong)] hover:shadow-subtle transition-all flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-page-subtle)] text-[#0d9488] dark:text-[#2dd4bf]">
                <Calculator className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                Räkna på besparingen
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            Se hur mycket du sparar på 1 år och 5 år om du avslutar prenumerationen.
          </p>
        </Link>
      </div>
    </section>
  );
}
