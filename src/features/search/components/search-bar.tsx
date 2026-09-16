'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export interface SearchBarProps {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ initialQuery = '', autoFocus = false, className = '' }: SearchBarProps) {
  const t = useTranslations('home');
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const fullPlaceholder = t('searchPlaceholder');
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');

  // Typewriter loop effect on search placeholder
  useEffect(() => {
    let currentIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    function step() {
      if (!isDeleting) {
        currentIdx++;
        setDisplayedPlaceholder(fullPlaceholder.slice(0, currentIdx));
        if (currentIdx >= fullPlaceholder.length) {
          isDeleting = true;
          timeoutId = setTimeout(step, 3200); // pause with full sentence
          return;
        }
        timeoutId = setTimeout(step, 48); // typing speed
      } else {
        currentIdx--;
        setDisplayedPlaceholder(fullPlaceholder.slice(0, currentIdx));
        if (currentIdx <= 0) {
          isDeleting = false;
          timeoutId = setTimeout(step, 800); // pause while completely cleared
          return;
        }
        timeoutId = setTimeout(step, 22); // deleting speed
      }
    }

    timeoutId = setTimeout(step, 400);
    return () => clearTimeout(timeoutId);
  }, [fullPlaceholder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = query.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim().slice(0, 100);
    if (!sanitized) return;
    router.push(`/sok?q=${encodeURIComponent(sanitized)}`);
  };

  return (
    <div className={`w-full max-w-2xl flex flex-col ${className}`.trim()}>
      <form onSubmit={handleSubmit} className="w-full flex flex-col min-[420px]:flex-row gap-2">
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            {fullPlaceholder}
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-text-subtle)]">
            <Search className="w-4 h-4 text-[#0284c7] dark:text-[#38bdf8]" aria-hidden="true" />
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
            placeholder={displayedPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-sm bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)] focus:border-[var(--color-text-muted)] rounded-[var(--radius-md)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus-visible:outline-none transition-colors shadow-xs"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="relative overflow-hidden shrink-0 min-h-[44px] group"
        >
          <span className="relative z-10">{t('searchButton')}</span>
          {/* Shimmer / Glimmer light reflection sweep */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 dark:via-white/20 to-transparent skew-x-[-20deg] animate-shimmer pointer-events-none"
          />
        </Button>
      </form>
    </div>
  );
}

