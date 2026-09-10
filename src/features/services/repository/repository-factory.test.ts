import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getServiceRepository } from './index';
import { FixtureServiceRepository } from './fixture-service-repository';
import { PostgresServiceRepository } from './postgres-service-repository';

describe('getServiceRepository factory', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns FixtureServiceRepository when BYESCRIBE_DATA_SOURCE is "fixtures" in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'fixtures');
    const repo = getServiceRepository();
    expect(repo).toBeInstanceOf(FixtureServiceRepository);
  });

  it('returns PostgresServiceRepository when BYESCRIBE_DATA_SOURCE is "postgres"', () => {
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'postgres');
    const repo = getServiceRepository();
    expect(repo).toBeInstanceOf(PostgresServiceRepository);
  });

  it('throws a security error if BYESCRIBE_DATA_SOURCE is set to "fixtures" in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BYESCRIBE_DATA_SOURCE', 'fixtures');
    expect(() => getServiceRepository()).toThrow('Security error');
  });
});
