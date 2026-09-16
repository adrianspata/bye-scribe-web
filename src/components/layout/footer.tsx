import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-page-subtle)] mt-auto py-10 transition-colors">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-4 sm:px-6 flex flex-col gap-6 text-xs text-[var(--color-text-muted)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 max-w-xl">
            <Link href="/" className="inline-block hover:opacity-85 transition-opacity w-fit" aria-label={t('brand')}>
              <Logo size="sm" />
            </Link>
            <p className="leading-relaxed font-normal">
              {t('disclaimer')}
            </p>
          </div>

          <nav aria-label="Sidfotsnavigation" className="flex flex-wrap gap-4 text-xs font-medium text-[var(--color-text-muted)]">
            <Link href="/sok" className="hover:text-[var(--color-text)] transition-colors">
              {tNav('search')}
            </Link>
            <Link href="/verktyg/uppsagningsmeddelande" className="hover:text-[var(--color-text)] transition-colors">
              {tNav('messageGenerator')}
            </Link>
            <Link href="/verktyg/besparingskalkylator" className="hover:text-[var(--color-text)] transition-colors">
              {tNav('calculator')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-6 text-[var(--color-text-subtle)]">
          <p>© {new Date().getFullYear()} {t('brand')}. {tFooter('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
