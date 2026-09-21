import postgres from 'postgres';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runIsolatedMigrationTest() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set.');
  }

  const sql = postgres(databaseUrl, { max: 1 });

  console.log('=== STARTING ISOLATED POSTGRESQL MIGRATION 0002 TEST ===\n');

  try {
    await sql.begin(async (tx) => {
      // 0. Ensure test environment reflects BookBeat as draft/unverified before migration
      await tx`
        UPDATE services
        SET publication_status = 'draft', verification_status = 'unverified', last_verified_at = NULL
        WHERE id = 'srv-bookbeat'
      `;

      console.log('1. Reading 0002_multi_language_translations.sql...');
      const migrationSql = readFileSync(
        join(process.cwd(), 'drizzle/0002_multi_language_translations.sql'),
        'utf-8'
      );

      // Split statements by --> statement-breakpoint
      const statements = migrationSql
        .split('--> statement-breakpoint')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      console.log(`2. Executing ${statements.length} migration statements in isolated transaction...`);
      for (const stmt of statements) {
        await tx.unsafe(stmt);
      }
      console.log('   Migration DDL, triggers and backfill executed successfully.');

      // 3. Verification: Explicit alias classification
      console.log('\n3. Verifying explicit alias classification:');
      const aliases = await tx`
        SELECT id, service_id, alias, locale FROM service_aliases WHERE service_id = 'srv-bookbeat' ORDER BY alias
      `;
      console.log('   Classified BookBeat Aliases:', aliases);
      const bbSverige = aliases.find((a) => a.alias === 'BookBeat Sverige');
      const bbGeneric = aliases.find((a) => a.alias === 'Book Beat');

      if (!bbSverige || bbSverige.locale !== 'sv') {
        throw new Error('BookBeat Sverige was not explicitly classified with locale = "sv"!');
      }
      if (!bbGeneric || bbGeneric.locale !== null) {
        throw new Error('Book Beat brand alias was not explicitly classified with locale = NULL (universal)!');
      }
      console.log('   ✓ Aliases explicitly classified: BookBeat Sverige -> sv, Book Beat -> NULL (universal).');

      // 4. Verification: Backfill faithfully preserving metadata (BookBeat as draft/unverified)
      console.log('\n4. Verifying service_translations backfill metadata:');
      const [bbTranslation] = await tx`
        SELECT id, service_id, locale, summary, publication_status, verification_status, last_verified_at, search_document IS NOT NULL as has_fts
        FROM service_translations
        WHERE service_id = 'srv-bookbeat' AND locale = 'sv'
      `;
      console.log('   BookBeat SV Translation:', bbTranslation);
      if (!bbTranslation) throw new Error('BookBeat SV translation missing!');
      if (bbTranslation.publication_status !== 'draft') throw new Error('BookBeat status is not draft!');
      if (bbTranslation.verification_status !== 'unverified') throw new Error('BookBeat verification is not unverified!');
      if (bbTranslation.last_verified_at !== null) throw new Error('BookBeat last_verified_at is not null!');

      // 5. Verification: Step translations
      console.log('\n5. Verifying Cancellation Steps translation backfill:');
      const stepTranslations = await tx`
        SELECT cst.id, cst.step_id, cst.locale, cst.title, cs.position
        FROM cancellation_step_translations cst
        JOIN cancellation_steps cs ON cs.id = cst.step_id
        WHERE cs.service_id = 'srv-bookbeat'
        ORDER BY cs.position
      `;
      console.log('   BookBeat Step Translations (SV):', stepTranslations);
      if (stepTranslations.length !== 4) {
        throw new Error(`Expected 4 translated steps for BookBeat, got ${stepTranslations.length}`);
      }

      // 6. Verification: Production-mode hiding test for BookBeat on /sv and /en
      console.log('\n6. Verifying that BookBeat (draft/unverified) is hidden in production mode on both /sv and /en:');
      
      // Public query on /sv (requires published + verified)
      const [svPublicQuery] = await tx`
        SELECT st.*
        FROM service_translations st
        JOIN services s ON s.id = st.service_id
        WHERE s.slug = 'bookbeat'
          AND st.locale = 'sv'
          AND st.publication_status = 'published'
          AND st.verification_status = 'verified'
      `;
      console.log('   /sv public query result (production mode):', svPublicQuery || 'null (404 Not Found)');
      if (svPublicQuery) throw new Error('BookBeat draft leaked into public /sv query in production mode!');

      // Public query on /en (requires published + verified + locale = en)
      const [enPublicQuery] = await tx`
        SELECT st.*
        FROM service_translations st
        JOIN services s ON s.id = st.service_id
        WHERE s.slug = 'bookbeat'
          AND st.locale = 'en'
      `;
      console.log('   /en query result (all modes):', enPublicQuery || 'null (404 Not Found)');
      if (enPublicQuery) throw new Error('BookBeat leaked into /en query!');

      // Preview query on /sv in development mode (includes drafts)
      const [svDraftPreviewQuery] = await tx`
        SELECT st.*
        FROM service_translations st
        JOIN services s ON s.id = st.service_id
        WHERE s.slug = 'bookbeat'
          AND st.locale = 'sv'
      `;
      console.log('   /sv preview query result (local dev preview=draft):', svDraftPreviewQuery ? `Found draft (ID: ${svDraftPreviewQuery.id})` : 'null');
      if (!svDraftPreviewQuery) throw new Error('BookBeat draft was not accessible in local dev preview mode!');

      // 7. Verification: FTS Search Document Language Isolation with service_aliases.locale
      console.log('\n7. Testing FTS trigger language filtering with service_aliases.locale:');
      const [existingCat] = await tx`SELECT id FROM categories LIMIT 1`;
      
      // Create multi-lingual test service
      await tx`
        INSERT INTO services (id, slug, name, name_normalized, category_id, publication_status, verification_status)
        VALUES ('srv-bilingual', 'bilingual-demo', 'AudioBook Portal', 'audiobook portal', ${existingCat.id}, 'published', 'verified')
      `;
      await tx`
        INSERT INTO service_translations (id, service_id, locale, summary, publication_status, verification_status)
        VALUES 
          ('tr-bi-sv', 'srv-bilingual', 'sv', 'Svensk portal för böcker', 'published', 'verified'),
          ('tr-bi-en', 'srv-bilingual', 'en', 'English audiobook portal', 'published', 'verified')
      `;

      await tx`
        INSERT INTO service_aliases (id, service_id, alias, alias_normalized, locale)
        VALUES 
          ('alias-bi-sv', 'srv-bilingual', 'Ljudboksklubben', 'ljudboksklubben', 'sv'),
          ('alias-bi-en', 'srv-bilingual', 'AudiobookClub', 'audiobookclub', 'en'),
          ('alias-bi-uni', 'srv-bilingual', 'ABP App', 'abp app', NULL)
      `;

      // 8. Test alias insertion with OMITTED locale (must default to 'sv')
      console.log('\n8. Testing new alias insertion with omitted locale:');
      await tx`
        INSERT INTO service_aliases (id, service_id, alias, alias_normalized)
        VALUES ('alias-omitted', 'srv-bilingual', 'Ljudboksfavoriter', 'ljudboksfavoriter')
      `;

      const [omittedAlias] = await tx`
        SELECT id, service_id, alias, locale FROM service_aliases WHERE id = 'alias-omitted'
      `;
      console.log('   Inserted alias with omitted locale:', omittedAlias);
      if (!omittedAlias || omittedAlias.locale !== 'sv') {
        throw new Error(`Expected omitted locale to default to 'sv', got '${omittedAlias?.locale}'!`);
      }
      console.log('   ✓ New alias with omitted locale safely defaulted to "sv".');

      // Check FTS index for both sv and en
      const [biFtsSv] = await tx`
        SELECT search_document::text FROM service_translations WHERE service_id = 'srv-bilingual' AND locale = 'sv'
      `;
      const [biFtsEn] = await tx`
        SELECT search_document::text FROM service_translations WHERE service_id = 'srv-bilingual' AND locale = 'en'
      `;

      console.log('   SV search_document:', biFtsSv.search_document);
      console.log('   EN search_document:', biFtsEn.search_document);

      // Verify SV includes sv alias, universal alias, and omitted (defaulted to sv) alias
      if (!biFtsSv.search_document.includes('ljudboksklubb')) {
        throw new Error('SV search_document missing Swedish alias!');
      }
      if (!biFtsSv.search_document.includes('abp')) {
        throw new Error('SV search_document missing Universal alias!');
      }
      if (!biFtsSv.search_document.includes('ljudboksfavorit')) {
        throw new Error('SV search_document missing defaulted Swedish alias (omitted locale)!');
      }
      if (biFtsSv.search_document.includes('audiobookclub')) {
        throw new Error('SV search_document leaked English alias!');
      }

      // Verify EN includes en alias, universal alias, but NOT sv or omitted (sv default) aliases
      if (!biFtsEn.search_document.includes('audiobookclub')) {
        throw new Error('EN search_document missing English alias!');
      }
      if (!biFtsEn.search_document.includes('abp')) {
        throw new Error('EN search_document missing Universal alias!');
      }
      if (biFtsEn.search_document.includes('ljudboksklubb')) {
        throw new Error('EN search_document leaked Swedish alias!');
      }
      if (biFtsEn.search_document.includes('ljudboksfavorit')) {
        throw new Error('EN search_document leaked defaulted Swedish alias (omitted locale)!');
      }

      console.log('   ✓ FTS index strictly filters aliases by locale and protects /en from unclassified Swedish aliases.');

      console.log('\n=== ALL ISOLATED TRANSACTION ASSERTIONS PASSED! ===');
      console.log('Rolling back transaction to ensure zero changes are written to Supabase staging...');
      
      // Force rollback
      throw new Error('ROLLBACK_INTENTIONAL');
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'ROLLBACK_INTENTIONAL') {
      console.log('\n✓ Transaction rolled back cleanly. Supabase staging database remains 100% untouched.');
    } else {
      console.error('Isolated migration test failed with error:', err);
      process.exit(1);
    }
  } finally {
    await sql.end();
  }
}

runIsolatedMigrationTest();
