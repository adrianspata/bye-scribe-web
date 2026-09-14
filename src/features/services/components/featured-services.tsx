import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getServiceRepository } from '../repository';
import { ServiceSummary } from '../types';
import { DatabaseUnconfiguredError } from '@/lib/errors';
import { getDataSourceMode } from '@/lib/env';
import { ChevronRight } from 'lucide-react';

export async function FeaturedServices() {
  const t = await getTranslations('home');
  const isFixtureMode = getDataSourceMode() === 'fixtures';

  let services: ServiceSummary[] = [];
  try {
    const repo = getServiceRepository();
    services = await repo.listPublishedServices({ limit: 4 });
  } catch (err) {
    if (err instanceof DatabaseUnconfiguredError) {
      services = [];
    } else {
      throw err;
    }
  }

  return (
    <section
      aria-labelledby="featured-services-heading"
      className="w-full flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="featured-services-heading"
          className="text-lg sm:text-xl font-bold tracking-tight text-[var(--color-text)]"
        >
          {t('guidesHeading')}
        </h2>
        {isFixtureMode && (
          <p className="text-xs text-[var(--color-text-muted)]">
            Tjänsterna nedan är exempeldata i den lokala utvecklingsmiljön.
          </p>
        )}
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/tjanster/${service.slug}`}
              className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-2 transition-all hover:border-[var(--color-border-strong)] hover:shadow-raised focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {service.name}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                {service.category.name}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-center text-sm text-[var(--color-text-muted)]">
          {t('guidesEmpty')}
        </div>
      )}
    </section>
  );
}
