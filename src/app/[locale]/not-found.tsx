import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <h1 className="text-5xl sm:text-6xl font-normal tracking-tight text-[var(--color-text)] mb-3 tabular-nums">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-normal text-[var(--color-text)] mb-3">
        {t('title')}
      </h2>
      <p className="text-sm text-[var(--color-text-muted)] max-w-md mb-8 leading-relaxed">
        {t('description')}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
