import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { hasLocale } from '@/i18n/request';
import { SkipLink } from '@/components/layout/skip-link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BRAND } from '@/config/brand';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-page)] text-[var(--color-text)]">
        <NextIntlClientProvider messages={messages}>
          <SkipLink />
          <Header />
          <main id="main-content" className="flex-1 max-w-[var(--spacing-container-max)] w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
