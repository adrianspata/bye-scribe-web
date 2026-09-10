import { z } from 'zod';
import {
  DatabaseUnconfiguredError,
  SecurityConfigurationError,
} from './errors';

const serverEnvSchema = z
  .object({
    DATABASE_URL: z.string().url().optional(),
    BYESCRIBE_DATA_SOURCE: z.enum(['fixtures', 'postgres']).optional(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  })
  .transform((data) => ({
    ...data,
    BYESCRIBE_DATA_SOURCE:
      data.BYESCRIBE_DATA_SOURCE ?? (data.NODE_ENV === 'production' ? 'postgres' : 'fixtures'),
  }));

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_SITE_URL must be a valid URL' })
    .default('http://localhost:3000')
    .transform((url) => url.replace(/\/+$/, '')),
  NEXT_PUBLIC_SUMMA_APP_STORE_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_SUMMA_APP_STORE_URL must be a valid URL' })
    .optional()
    .or(z.literal(''))
    .default(''),
});

/**
 * Public client environment variables accessible anywhere.
 */
export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  NEXT_PUBLIC_SUMMA_APP_STORE_URL: process.env.NEXT_PUBLIC_SUMMA_APP_STORE_URL || '',
});

function isClientSide(): boolean {
  // In pure browser environments (not running Vitest runner), window is present
  return typeof window !== 'undefined' && process.env.NODE_ENV !== 'test' && !process.env.VITEST;
}

/**
 * Validated server environment variables.
 * Throws if accessed on the client.
 */
export function getServerEnv() {
  if (isClientSide()) {
    throw new Error('Server environment variables cannot be accessed in client code.');
  }

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new SecurityConfigurationError(`Invalid server environment configuration: ${errorDetails}`);
  }
  return parsed.data;
}

/**
 * Helper to get DATABASE_URL on demand. Throws DatabaseUnconfiguredError if missing.
 */
export function getDatabaseUrl(): string {
  const env = getServerEnv();
  if (!env.DATABASE_URL) {
    throw new DatabaseUnconfiguredError(
      'DATABASE_URL is not configured in the environment. Please define DATABASE_URL.'
    );
  }
  return env.DATABASE_URL;
}

/**
 * Validates and returns the configured data source mode.
 * Enforces that production cannot silently fall back to fixtures.
 */
export function getDataSourceMode(): 'fixtures' | 'postgres' {
  const env = getServerEnv();
  if (env.NODE_ENV === 'production' && env.BYESCRIBE_DATA_SOURCE === 'fixtures') {
    throw new SecurityConfigurationError(
      'Security error: BYESCRIBE_DATA_SOURCE cannot be set to "fixtures" in a production environment.'
    );
  }
  return env.BYESCRIBE_DATA_SOURCE;
}
