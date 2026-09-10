import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDatabaseUrl } from '@/lib/env';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Lazily acquires the database instance.
 * Avoids any connection attempts during module import or static build.
 */
export function getDb() {
  if (!dbInstance) {
    const databaseUrl = getDatabaseUrl();
    const client = postgres(databaseUrl, { max: 10 });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}
