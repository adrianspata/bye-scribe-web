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
    'ByeScribe helps consumers find step-by-step instructions, terms, and tools to cancel subscriptions and save money.',
  description:
    'ByeScribe helps you find step-by-step instructions, terms, and contact paths to cancel subscriptions.',
  disclaimer:
    'ByeScribe helps consumers find instructions to cancel subscriptions. We never cancel services automatically.',
  futureArchitecture: [
    'ByeScribe Guides',
    'ByeScribe Assistant',
    'ByeScribe for Business',
    'ByeScribe × Summa',
  ],
} as const;

export type BrandConfig = typeof BRAND;
