import { defineConfig } from 'drizzle-kit';

const isMigrateCommand = process.argv.some((arg) => arg.includes('migrate'));
const rawMigrationUrl = process.env.DATABASE_MIGRATION_URL;

if (isMigrateCommand && !rawMigrationUrl) {
  throw new Error(
    'DATABASE_MIGRATION_URL is required for running migrations. Direct connection or session pooler must be used without fallback to DATABASE_URL.'
  );
}

let migrationUrl = rawMigrationUrl || '';
if (migrationUrl) {
  try {
    const u = new URL(migrationUrl);
    if (!u.searchParams.has('sslmode')) {
      u.searchParams.set('sslmode', 'require');
    }
    migrationUrl = u.toString();
  } catch {}
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: migrationUrl,
    ssl: 'require',
  },
  verbose: true,
  strict: true,
});


