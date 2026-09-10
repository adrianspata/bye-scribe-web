'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
}

export function SearchBar({ initialQuery = '', autoFocus = false }: SearchBarProps) {
  const t = useTranslations('home');
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = query.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim().slice(0, 100);
    if (!sanitized) return;
    router.push(`/sok?q=${encodeURIComponent(sanitized)}`);
  };

  return (
    <div className="w-full max-w-xl flex flex-col">
      <form onSubmit={handleSubmit} className="w-full flex flex-col min-[420px]:flex-row gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            {t('searchPlaceholder')}
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-subtle)]">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="search"
            name="q"
            maxLength={100}
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby="search-privacy-hint"
            placeholder={t('searchPlaceholder')}
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] rounded-[var(--radius-md)] placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-1 transition-all shadow-xs"
          />
        </div>
        <Button type="submit" variant="primary" size="md" className="shrink-0 min-h-[44px]">
          {t('searchButton')}
        </Button>
      </form>
      <p id="search-privacy-hint" className="text-xs text-[var(--color-text-muted)] mt-2 leading-relaxed">
        Sök endast efter tjänstens namn. Skriv inte personnummer, medlemsnummer eller andra personuppgifter.
      </p>
    </div>
  );
}
