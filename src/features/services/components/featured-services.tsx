import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getServiceRepository } from '../repository';
import { ServiceSummary } from '../types';
import { DatabaseUnconfiguredError, CategoryConfigurationError } from '@/lib/errors';
import { getDataSourceMode } from '@/lib/env';
import { ChevronRight } from 'lucide-react';
import { TypingSectionHeading } from '@/components/ui/typing-section-heading';

export async function FeaturedServices() {
  const t = await getTranslations('home');
  const tCategories = await getTranslations('categories');
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
        <TypingSectionHeading
          id="featured-services-heading"
          text={t('guidesHeading')}
          className="text-lg sm:text-xl font-normal tracking-tight text-[var(--color-text)]"
        />
        {isFixtureMode && (
          <p className="text-xs text-[var(--color-text-muted)]">
            The services below are sample data in the local development environment.
          </p>
        )}
      </div>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service) => {
            let categoryLabel: string | null = null;
            if (service.category?.slug) {
              if (tCategories.has(service.category.slug)) {
                categoryLabel = tCategories(service.category.slug);
              } else {
                throw new CategoryConfigurationError(service.category.slug, 'active_locale');
              }
            }

            return (
              <Link
                key={service.id}
                href={`/tjanster/${service.slug}`}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-border-strong)] hover:shadow-subtle focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] outline-none"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {service.name}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" aria-hidden="true" />
                </div>
                {categoryLabel && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {categoryLabel}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="w-full p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] text-center text-xs text-[var(--color-text-muted)]">
          {t('guidesEmpty')}
        </div>
      )}
    </section>
  );
}
