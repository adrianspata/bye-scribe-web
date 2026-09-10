'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

export function Header() {
  const t = useTranslations('common');
  const tNav = useTranslations('nav');
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement>(null);

  const navItems = [
    { href: '/', label: tNav('home') },
    { href: '/sok', label: tNav('search') },
    { href: '/verktyg/besparingskalkylator', label: tNav('calculator') },
    { href: '/verktyg/uppsagningsmeddelande', label: tNav('messageGenerator') },
  ];

  // Handle ESC key to close mobile menu & return focus
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Focus first link on open
  useEffect(() => {
    if (mobileMenuOpen) {
      requestAnimationFrame(() => {
        firstNavLinkRef.current?.focus();
      });
    }
  }, [mobileMenuOpen]);

  const toggleMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    } else {
      setMobileMenuOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-page)]/95 backdrop-blur-md">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-4 sm:px-6 h-[var(--spacing-header-height)] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Temporary Typographic Wordmark */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center text-lg sm:text-xl font-black tracking-tight text-[var(--color-text)] hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-md px-1 py-0.5 shrink-0"
        >
          <span>{t('brand')}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Huvudnavigation"
          className="hidden lg:flex items-center gap-2 text-sm font-medium h-full"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative h-[var(--spacing-header-height)] px-3 transition-colors select-none flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                  isActive
                    ? 'text-[var(--color-text)] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2.5px] after:bg-[var(--color-accent)] after:rounded-t-full'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={toggleMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? tNav('closeMenu') : tNav('openMenu')}
            className="w-11 h-11 min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-page-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobil huvudnavigation"
          className="lg:hidden border-b border-[var(--color-border)] bg-[var(--color-page)] px-4 py-3 shadow-md flex flex-col gap-1.5 transition-all"
        >
          <div className="flex flex-col gap-1">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  ref={idx === 0 ? firstNavLinkRef : undefined}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
                    isActive
                      ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] font-bold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-page-subtle)]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
