import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDatabaseUrl } from '@/lib/env';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Lazily acquires the server-side database instance.
 * Avoids connection attempts during module import or static build.
 * Configured with prepare: false for Supabase Transaction Pooler compatibility.
 */
export function getDb() {
  if (!dbInstance) {
    const databaseUrl = getDatabaseUrl();
    const client = postgres(databaseUrl, {
      max: 1,
      prepare: false,
      ssl: 'require',
    });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

