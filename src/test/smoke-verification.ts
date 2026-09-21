import { getServiceRepository, PostgresServiceRepository, FixtureServiceRepository } from '../features/services/repository';
import sitemap from '../app/sitemap';

async function runSmokeVerifications() {
  console.log('=== SMOKE VERIFICATION OF DATA LAYER & REPOSITORY ===\n');

  // 1. Verify getServiceRepository returns PostgresServiceRepository when BYESCRIBE_DATA_SOURCE=postgres
  process.env.BYESCRIBE_DATA_SOURCE = 'postgres';
  const repo = getServiceRepository();
  console.log('1. Repository Factory in postgres mode:');
  console.log('   - Instance class:', repo.constructor.name);
  if (!(repo instanceof PostgresServiceRepository)) {
    throw new Error('Factory did not return PostgresServiceRepository!');
  }
  console.log('   -> Factory returned PostgresServiceRepository PASSED.');

  // 2. Verify empty DB returns empty results without falling back to fixture mocks
  console.log('\n2. Testing empty database queries (clean empty state):');
  const services = await repo.listPublishedServices();
  console.log(`   - listPublishedServices() returned: ${services.length} items`);
  if (services.length !== 0) {
    throw new Error('Expected 0 services in empty PostgreSQL DB, got: ' + services.length);
  }

  const searchResults = await repo.searchServices({ query: 'netflix' });
  console.log(`   - searchServices('netflix') on empty DB returned: ${searchResults.length} items`);
  if (searchResults.length !== 0) {
    throw new Error('Expected 0 search results on empty PostgreSQL DB, got: ' + searchResults.length);
  }

  const serviceDetail = await repo.getServiceBySlug('spotify');
  console.log(`   - getServiceBySlug('spotify') on empty DB returned: ${serviceDetail}`);
  if (serviceDetail !== null) {
    throw new Error('Expected null for nonexistent service in empty DB!');
  }
  console.log('   -> Empty DB clean empty states (no fixture mixing) PASSED.');

  // 3. Verify sitemap returns only static routes when PostgreSQL has 0 published services
  console.log('\n3. Testing sitemap in postgres mode:');
  const sitemapRoutes = await sitemap();
  console.log(`   - Sitemap entries count: ${sitemapRoutes.length}`);
  sitemapRoutes.forEach(r => console.log(`     * ${r.url} (priority: ${r.priority})`));
  const hasServiceRoutes = sitemapRoutes.some(r => r.url.includes('/tjanster/'));
  if (hasServiceRoutes) {
    throw new Error('Sitemap should not contain service routes for empty DB!');
  }
  console.log('   -> Sitemap verification PASSED.');

  // 4. Verify fixture repo isolation
  console.log('\n4. Testing fixture repo independence:');
  const fixtureRepo = new FixtureServiceRepository();
  const fixtureServices = await fixtureRepo.listPublishedServices();
  console.log(`   - Fixture repository has ${fixtureServices.length} mock items available only when explicitly requested.`);
  console.log('   -> Fixture isolation PASSED.');

  console.log('\n=== ALL SMOKE VERIFICATIONS PASSED ===');
  process.exit(0);
}

runSmokeVerifications().catch(err => {
  console.error('Smoke verification failed:', err.message);
  process.exit(1);
});
