import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { clientEnv, getDatabaseUrl, getDataSourceMode } from './env';

describe('env validation', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('provides default NEXT_PUBLIC_SITE_URL on clientEnv', () => {
    expect(clientEnv.NEXT_PUBLIC_SITE_URL).toBeDefined();
    expect(clientEnv.NEXT_PUBLIC_SITE_URL).not.toMatch(/\/+$/);
  });

  it('throws a clear error when getDatabaseUrl is called without DATABASE_URL', () => {
    vi.stubEnv('DATABASE_URL', '');
    delete process.env.DATABASE_URL;
    expect(() => getDatabaseUrl()).toThrow('DATABASE_URL is not configured');
  });

  it('returns DATABASE_URL when properly configured', () => {
    vi.stubEnv('DATABASE_URL', 'postgres://user:pass@localhost:5432/byescribe');
    expect(getDatabaseUrl()).toBe('postgres://user:pass@localhost:5432/byescribe');
  });

  it('returns default data source mode as fixtures in development', () => {
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'fixtures');
    expect(getDataSourceMode()).toBe('fixtures');
  });

  it('prevents fixtures mode in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'fixtures');
    expect(() => getDataSourceMode()).toThrow('Security error');
  });

  it('throws a clear error when BYESCRIBE_DATA_SOURCE has an invalid value', () => {
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'invalid-source');
    expect(() => getDataSourceMode()).toThrow('Invalid server environment configuration');
  });
});
