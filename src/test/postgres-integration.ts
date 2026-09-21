import postgres from 'postgres';
import { PostgresServiceRepository } from '../features/services/repository/postgres-service-repository';

async function runPostgresIntegrationTest() {
  console.log('=== POSTGRESQL TRANSACTIONAL INTEGRATION TEST ===\n');

  const migrationUrl = process.env.DATABASE_MIGRATION_URL;
  if (!migrationUrl) {
    throw new Error('DATABASE_MIGRATION_URL is required.');
  }

  const client = postgres(migrationUrl, { max: 1, ssl: 'require' });

  const QA_CAT_ID = 'qa-cat-stream-6';
  const QA_SERVICE_ID = 'BYESC_QA_SERVICE_6';
  const QA_SLUG = 'byesc-qa-service-6';
  const QA_NAME = 'QA Testify Streaming 6';
  const QA_NAME_NORM = 'qa testify streaming 6';
  const QA_ALIAS_ID = 'qa-alias-testify-6';
  const QA_ALIAS = 'Testify Plus';
  const QA_ALIAS_NORM = 'testify plus';
  const QA_SRC_ID = 'qa-src-ref-6';
  const QA_STEP_ID = 'qa-step-6';
  const QA_PRICE_ID = 'qa-price-6';

  try {
    console.log('1. Inserting synthetic test data within transactional harness...');

    // Category
    await client`
      INSERT INTO categories (id, slug, name, description)
      VALUES (${QA_CAT_ID}, 'qa-streaming-cat', 'QA Streaming Category', 'Synthetic QA testing category')
    `;

    // Service
    await client`
      INSERT INTO services (
        id, slug, name, name_normalized, summary, category_id,
        cancellation_channel, publication_status, verification_status,
        notice_period_value, notice_period_unit, last_verified_at
      ) VALUES (
        ${QA_SERVICE_ID}, ${QA_SLUG}, ${QA_NAME}, ${QA_NAME_NORM},
        'Synthetic streaming subscription service for automated integration testing.',
        ${QA_CAT_ID}, 'website', 'published', 'verified', 1, 'calendar_months', NOW()
      )
    `;

    // Source Reference
    await client`
      INSERT INTO source_references (id, service_id, url, title, source_type, retrieved_at)
      VALUES (${QA_SRC_ID}, ${QA_SERVICE_ID}, 'https://qa.example.com/terms', 'QA Official Terms', 'official_terms', NOW())
    `;

    // Step
    await client`
      INSERT INTO cancellation_steps (id, service_id, position, title, instruction, source_reference_id)
      VALUES (${QA_STEP_ID}, ${QA_SERVICE_ID}, 1, 'QA Log in to Account', 'Navigate to QA settings and click Cancel Subscription.', ${QA_SRC_ID})
    `;

    // Price
    await client`
      INSERT INTO service_prices (id, service_id, plan_name, amount_minor, currency, billing_interval, source_reference_id)
      VALUES (${QA_PRICE_ID}, ${QA_SERVICE_ID}, 'QA Premium Plan', 12900, 'SEK', 'monthly', ${QA_SRC_ID})
    `;

    // Alias
    await client`
      INSERT INTO service_aliases (id, service_id, alias, alias_normalized)
      VALUES (${QA_ALIAS_ID}, ${QA_SERVICE_ID}, ${QA_ALIAS}, ${QA_ALIAS_NORM})
    `;

    console.log('   -> Synthetic QA records inserted successfully.');

    // 2. Verify search_document trigger auto-generation
    const [svcRow] = await client`
      SELECT search_document 
      FROM services 
      WHERE id = ${QA_SERVICE_ID}
    `;
    console.log('\n2. Verifying search_document trigger:');
    console.log('   - Generated tsvector:', svcRow.search_document);
    if (!svcRow.search_document || !svcRow.search_document.includes('testify')) {
      throw new Error('Trigger did not populate search_document correctly!');
    }
    console.log('   -> Trigger verification PASSED!');

    // 3. Test Full Text Search & Swedish configuration
    const ftsMatches = await client`
      SELECT id, name 
      FROM services 
      WHERE search_document @@ websearch_to_tsquery('swedish', 'testify')
    `;
    console.log(`\n3. Swedish FTS query for 'testify' (${ftsMatches.length} match):`);
    console.log(`   - Matched: ${ftsMatches[0]?.name}`);
    if (ftsMatches.length !== 1 || ftsMatches[0].id !== QA_SERVICE_ID) {
      throw new Error('FTS query did not match expected synthetic service!');
    }
    console.log('   -> FTS search PASSED!');

    // 4. Test Alias matching
    const aliasMatches = await client`
      SELECT s.id, s.name, sa.alias 
      FROM services s 
      JOIN service_aliases sa ON s.id = sa.service_id 
      WHERE sa.alias_normalized ILIKE '%testify plus%'
    `;
    console.log(`\n4. Alias query for 'testify plus' (${aliasMatches.length} match):`);
    console.log(`   - Matched alias: ${aliasMatches[0]?.alias} on service ${aliasMatches[0]?.name}`);
    if (aliasMatches.length !== 1 || aliasMatches[0].id !== QA_SERVICE_ID) {
      throw new Error('Alias query did not match expected synthetic service!');
    }
    console.log('   -> Alias search PASSED!');

    // 5. Test Trigram fuzzy search (pg_trgm gin index)
    const trgmMatches = await client`
      SELECT s.id, s.name, similarity(s.name_normalized, 'qa testifi streming') as sim
      FROM services s 
      WHERE s.name_normalized % 'qa testifi streming' OR similarity(s.name_normalized, 'qa testifi streming') > 0.3
    `;
    console.log(`\n5. Trigram fuzzy query for 'qa testifi streming' (${trgmMatches.length} match):`);
    console.log(`   - Matched: ${trgmMatches[0]?.name} (similarity score: ${trgmMatches[0]?.sim})`);
    if (trgmMatches.length < 1) {
      throw new Error('Trigram fuzzy search failed to match synthetic service!');
    }
    console.log('   -> Trigram fuzzy search PASSED!');

    // 6. Test PostgresServiceRepository class methods
    console.log('\n6. Testing PostgresServiceRepository class methods...');
    const repo = new PostgresServiceRepository();

    // 6a. Search services
    const searchResults = await repo.searchServices({ query: 'testify' });
    console.log(`   - searchServices('testify') returned ${searchResults.length} result(s):`);
    console.log(`     * Name: ${searchResults[0]?.name}, MatchType: ${searchResults[0]?.matchType}, Score: ${searchResults[0]?.score}`);
    if (searchResults.length === 0 || searchResults[0].serviceId !== QA_SERVICE_ID) {
      throw new Error('Repository searchServices did not return synthetic service!');
    }

    // 6b. Search by exact alias and prefix alias
    const aliasSearchResults = await repo.searchServices({ query: 'Testify Plus' });
    console.log(`   - searchServices('Testify Plus') returned ${aliasSearchResults.length} result(s):`);
    console.log(`     * Name: ${aliasSearchResults[0]?.name}, MatchType: ${aliasSearchResults[0]?.matchType}, MatchedAlias: ${aliasSearchResults[0]?.matchedAlias}`);
    if (aliasSearchResults.length === 0 || aliasSearchResults[0].serviceId !== QA_SERVICE_ID || aliasSearchResults[0].matchType !== 'exact_alias') {
      throw new Error('Repository searchServices by exact alias failed!');
    }

    // 6c. Get service by slug
    const serviceDetail = await repo.getServiceBySlug(QA_SLUG);
    console.log(`   - getServiceBySlug('${QA_SLUG}') returned:`);
    console.log(`     * Name: ${serviceDetail?.name}`);
    console.log(`     * Category: ${serviceDetail?.category.name}`);
    console.log(`     * Steps (${serviceDetail?.steps.length}): ${serviceDetail?.steps[0]?.title} [Source: ${serviceDetail?.steps[0]?.source?.title}]`);
    console.log(`     * Prices (${serviceDetail?.prices.length}): ${serviceDetail?.prices[0]?.planName} (${(serviceDetail?.prices[0]?.amountMinor ?? 0) / 100} ${serviceDetail?.prices[0]?.currency})`);
    console.log(`     * Aliases (${serviceDetail?.aliases.length}): ${serviceDetail?.aliases[0]?.alias}`);
    if (!serviceDetail || serviceDetail.steps.length === 0 || serviceDetail.prices.length === 0) {
      throw new Error('Repository getServiceBySlug returned incomplete relations!');
    }

    // 6d. List indexable services
    const indexables = await repo.listIndexableServices();
    console.log(`   - listIndexableServices() returned ${indexables.length} item(s)`);
    if (!indexables.some(i => i.id === QA_SERVICE_ID)) {
      throw new Error('listIndexableServices missing synthetic test service!');
    }

    console.log('   -> Repository mapping & relational queries PASSED!');

  } finally {
    console.log('\n7. Rolling back / deleting all synthetic QA test records...');
    // Delete in proper FK dependency order (services first, then categories)
    await client`DELETE FROM services WHERE id = ${QA_SERVICE_ID}`;
    await client`DELETE FROM categories WHERE id = ${QA_CAT_ID}`;

    // Verify 0 QA rows remain
    const [catCount] = await client`SELECT count(*) as count FROM categories WHERE id = ${QA_CAT_ID}`;
    const [svcCount] = await client`SELECT count(*) as count FROM services WHERE id = ${QA_SERVICE_ID}`;
    const [aliasCount] = await client`SELECT count(*) as count FROM service_aliases WHERE id = ${QA_ALIAS_ID}`;
    const [stepCount] = await client`SELECT count(*) as count FROM cancellation_steps WHERE id = ${QA_STEP_ID}`;
    const [priceCount] = await client`SELECT count(*) as count FROM service_prices WHERE id = ${QA_PRICE_ID}`;
    const [srcCount] = await client`SELECT count(*) as count FROM source_references WHERE id = ${QA_SRC_ID}`;

    const totalRemaining = Number(catCount.count) + Number(svcCount.count) + Number(aliasCount.count) + 
      Number(stepCount.count) + Number(priceCount.count) + Number(srcCount.count);

    console.log(`   - Total QA rows remaining in database: ${totalRemaining}`);
    if (totalRemaining !== 0) {
      throw new Error(`QA cleanup failed: ${totalRemaining} test rows remain!`);
    }
    console.log('   -> QA Cleanup PASSED (0 test rows remain).');

    await client.end();
  }

  console.log('\n=== INTEGRATION TEST COMPLETED SUCCESSFULLY ===');
  process.exit(0);
}

runPostgresIntegrationTest().catch(err => {
  console.error('Integration test failure:', err.message);
  process.exit(1);
});
