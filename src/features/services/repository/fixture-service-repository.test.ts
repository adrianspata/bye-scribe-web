import { describe, it, expect } from 'vitest';
import { FixtureServiceRepository } from './fixture-service-repository';

describe('FixtureServiceRepository Hardening', () => {
  const repo = new FixtureServiceRepository();

  it('only returns published and verified services in listPublishedServices', async () => {
    const services = await repo.listPublishedServices();
    expect(services).toHaveLength(2);
    expect(services.map((s) => s.slug)).toEqual([
      'nordicplay-demo',
      'fjallgym-demo',
    ]);

    const slugs = services.map((s) => s.slug);
    expect(slugs).not.toContain('draftljud-demo');
    expect(slugs).not.toContain('overifierad-clean-demo');
    expect(slugs).not.toContain('gammeltidning-demo');
  });

  it('returns full service details and attaches valid step sources', async () => {
    const service = await repo.getServiceBySlug('nordicplay-demo');
    expect(service).not.toBeNull();
    expect(service?.steps).toHaveLength(3);

    // Verify each step has its source attached
    for (const step of service?.steps || []) {
      expect(step.sourceReferenceId).toBe('src-np-1');
      expect(step.source).toBeDefined();
      expect(step.source?.title).toContain('NordicPlay');
      expect(step.source?.serviceId).toBe('srv-nordicplay-001');
    }
  });

  it('filters services by category in listPublishedServices', async () => {
    const streamingServices = await repo.listPublishedServices({
      categoryId: 'cat-streaming-001',
    });
    expect(streamingServices).toHaveLength(1);
    expect(streamingServices[0].slug).toBe('nordicplay-demo');
  });

  it('only returns published and verified services in listIndexableServices', async () => {
    const indexable = await repo.listIndexableServices();
    expect(indexable).toHaveLength(2);
    expect(indexable.map((i) => i.slug)).toEqual([
      'nordicplay-demo',
      'fjallgym-demo',
    ]);
  });

  it('returns null when querying unverified, draft, or archived services', async () => {
    expect(await repo.getServiceBySlug('draftljud-demo')).toBeNull();
    expect(await repo.getServiceBySlug('overifierad-clean-demo')).toBeNull();
    expect(await repo.getServiceBySlug('gammeltidning-demo')).toBeNull();
  });

  it('searches services and deduplicates matches across aliases', async () => {
    const results = await repo.searchServices({ query: 'Nordic' });
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe('nordicplay-demo');
    expect(results[0].nameNormalized).toBe('nordicplay demo');
  });

  it('returns categories properly', async () => {
    const categories = await repo.listCategories();
    expect(categories.length).toBeGreaterThanOrEqual(4);
    expect(categories.map((c) => c.slug)).toContain('streaming');
  });
});
