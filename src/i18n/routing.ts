import { defineRouting } from 'next-intl/routing';

/**
 * ByeScribe Routing Configuration
 * 
 * Swedish ('sv') is the only active locale currently.
 * Planned future locales: Norwegian ('no'), Danish ('da'), English ('en').
 */
export const routing = defineRouting({
  locales: ['en', 'sv'] as const,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
