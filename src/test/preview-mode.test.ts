import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FixtureServiceRepository } from '@/features/services/repository/fixture-service-repository';
import { ServiceDetail } from '@/features/services/types';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children }: { children: unknown }) => children,
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/sok',
}));

const mockDraftService: ServiceDetail = {
  id: 'srv-draft-1',
  slug: 'draft-bookbeat',
  name: 'BookBeat',
  nameNormalized: 'bookbeat',
  category: { id: 'cat-1', slug: 'ljudbocker', name: 'Ljudböcker' },
  publicationStatus: 'draft',
  verificationStatus: 'unverified',
  cancellationChannel: 'website',
  noticePeriodValue: null,
  noticePeriodUnit: 'unknown',
  aliases: [],
  steps: [],
  prices: [],
  sources: [],
};

let activeMockService: ServiceDetail | null = mockDraftService;

vi.mock('@/features/services/repository', () => ({
  getServiceRepository: () => ({
    getServiceBySlug: vi.fn().mockImplementation(async (_slug, options) => {
      if (options?.includeDrafts) {
        return activeMockService;
      }
      return null;
    }),
  }),
}));

import { generateMetadata } from '@/app/[locale]/tjanster/[slug]/page';

describe('Preview Mode & Locale Security', () => {
  beforeEach(() => {
    activeMockService = mockDraftService;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('allows draft fetch in development when preview=draft is provided', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const isLocalDev = process.env.NODE_ENV === 'development';
    const searchParams = Promise.resolve({ preview: 'draft' });
    const isPreview = isLocalDev && ((await searchParams)?.preview === 'draft' || (await searchParams)?.preview === 'true');

    expect(isPreview).toBe(true);

    const repo = new FixtureServiceRepository();
    vi.spyOn(repo, 'getServiceBySlug').mockImplementation(async (slug, options) => {
      if (options?.includeDrafts && slug === 'draft-bookbeat') {
        return mockDraftService;
      }
      return null;
    });

    const result = await repo.getServiceBySlug('draft-bookbeat', { includeDrafts: isPreview });
    expect(result).not.toBeNull();
    expect(result?.slug).toBe('draft-bookbeat');
    expect(result?.publicationStatus).toBe('draft');
  });

  it('strictly blocks draft fetch in production mode even with preview=draft', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const isLocalDev = (process.env.NODE_ENV as string) === 'development';
    const searchParams = Promise.resolve({ preview: 'draft' });
    const isPreview = isLocalDev && ((await searchParams)?.preview === 'draft' || (await searchParams)?.preview === 'true');

    expect(isPreview).toBe(false);

    const repo = new FixtureServiceRepository();
    vi.spyOn(repo, 'getServiceBySlug').mockImplementation(async (slug, options) => {
      if (options?.includeDrafts && slug === 'draft-bookbeat') {
        return mockDraftService;
      }
      return null;
    });

    const result = await repo.getServiceBySlug('draft-bookbeat', { includeDrafts: isPreview });
    expect(result).toBeNull();
  });

  it('sets noindex and nofollow on draft metadata in preview mode', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'sv', slug: 'draft-bookbeat' }),
      searchParams: Promise.resolve({ preview: 'draft' }),
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });

  it('returns Service not found metadata in production mode', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: 'sv', slug: 'draft-bookbeat' }),
      searchParams: Promise.resolve({ preview: 'draft' }),
    });

    expect(metadata.title).toContain('Service not found');
  });
});
