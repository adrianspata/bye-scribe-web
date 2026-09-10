import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

export function hasLocale(
  locales: readonly string[],
  locale: unknown
): locale is (typeof locales)[number] {
  return typeof locale === 'string' && locales.includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
