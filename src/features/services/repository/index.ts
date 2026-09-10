import { getDataSourceMode } from '@/lib/env';
import { ServiceRepository } from './service-repository';
import { FixtureServiceRepository } from './fixture-service-repository';
import { PostgresServiceRepository } from './postgres-service-repository';

let fixtureRepoInstance: FixtureServiceRepository | null = null;
let postgresRepoInstance: PostgresServiceRepository | null = null;

/**
 * Returns the configured service repository instance based on BYESCRIBE_DATA_SOURCE.
 * In production, setting BYESCRIBE_DATA_SOURCE='fixtures' is prevented with a security error.
 */
export function getServiceRepository(): ServiceRepository {
  const mode = getDataSourceMode();

  if (mode === 'fixtures') {
    if (!fixtureRepoInstance) {
      fixtureRepoInstance = new FixtureServiceRepository();
    }
    return fixtureRepoInstance;
  }

  if (!postgresRepoInstance) {
    postgresRepoInstance = new PostgresServiceRepository();
  }
  return postgresRepoInstance;
}

export * from './service-repository';
export * from './fixture-service-repository';
export * from './postgres-service-repository';
