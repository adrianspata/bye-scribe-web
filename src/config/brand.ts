/**
 * ByeScribe Brand Configuration
 * 
 * Central, isomorphic brand configuration.
 * Client- and server-safe (no server-only imports or secrets).
 */

export const BRAND = {
  name: 'ByeScribe',
  tagline: 'The easier way to unsubscribe.',
  shortDescription:
    'ByeScribe hjälper konsumenter att hitta instruktioner, villkor och verktyg för att säga upp abonnemang och spara pengar.',
  description:
    'ByeScribe hjälper dig att hitta steg-för-steg-instruktioner, villkor och kontaktvägar för att säga upp abonnemang i Sverige.',
  disclaimer:
    'ByeScribe hjälper konsumenter att hitta instruktioner för att säga upp abonnemang. Vi säger aldrig upp tjänster automatiskt.',
  futureArchitecture: [
    'ByeScribe Guides',
    'ByeScribe Assistant',
    'ByeScribe for Business',
    'ByeScribe × Summa',
  ],
} as const;

export type BrandConfig = typeof BRAND;
