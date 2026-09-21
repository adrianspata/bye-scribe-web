import path from 'node:path';
import postgres from 'postgres';
import { readMigrationFiles } from 'drizzle-orm/migrator';

/**
 * Robust Supabase-compatible Drizzle migration runner.
 * Executes migrations deterministically inside PostgreSQL transactions and records metadata in public.__drizzle_migrations.
 */
export async function runMigrations() {
  const migrationUrl = process.env.DATABASE_MIGRATION_URL;
  if (!migrationUrl) {
    throw new Error(
      'DATABASE_MIGRATION_URL is required for running migrations. Direct connection or session pooler must be used without fallback to DATABASE_URL.'
    );
  }

  const client = postgres(migrationUrl, {
    max: 1,
    ssl: 'require',
    connect_timeout: 15,
  });

  try {
    console.log('Reading Drizzle migration files and journal...');
    const migrations = readMigrationFiles({
      migrationsFolder: path.resolve(process.cwd(), 'drizzle'),
    });

    console.log(`Found ${migrations.length} migration(s) in journal.`);

    // Ensure metadata table exists in public schema
    await client`
      CREATE TABLE IF NOT EXISTS public.__drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL,
        created_at BIGINT
      )
    `;

    // Fetch last applied migration
    const lastMigrationRows = await client`
      SELECT id, hash, created_at 
      FROM public.__drizzle_migrations 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const lastDbMigration = lastMigrationRows[0];

    // Filter unapplied migrations
    const unappliedMigrations = migrations.filter((m) => {
      return !lastDbMigration || Number(lastDbMigration.created_at) < m.folderMillis;
    });

    if (unappliedMigrations.length === 0) {
      console.log('No pending migrations to apply. Database is up to date.');
      return;
    }

    console.log(`Applying ${unappliedMigrations.length} pending migration(s)...`);

    for (const migration of unappliedMigrations) {
      console.log(`Applying migration timestamp ${migration.folderMillis}...`);
      await client.begin(async (tx) => {
        for (const statement of migration.sql) {
          const trimmed = statement.trim();
          if (!trimmed) continue;
          await tx.unsafe(trimmed);
        }
        await tx`
          INSERT INTO public.__drizzle_migrations (hash, created_at) 
          VALUES (${migration.hash}, ${migration.folderMillis})
        `;
      });
      console.log(`Successfully applied and recorded migration ${migration.folderMillis}.`);
    }

    console.log('All migrations applied successfully!');
  } finally {
    await client.end({ timeout: 5 });
  }
}

if (process.argv[1]?.endsWith('migrate.ts') || process.argv[1]?.endsWith('migrate.js')) {
  runMigrations().catch((err) => {
    console.error('Migration execution failed:', err.message);
    process.exit(1);
  });
}
