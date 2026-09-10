import {
  Category,
  IndexableService,
  ServiceDetail,
  ServiceSummary,
} from '../types';
import {
  SearchParams,
  SearchResult,
  searchQuerySchema,
} from '@/features/search/types';
import { scoreService, sortSearchResults } from '@/features/search/ranking';
import {
  ListPublishedServicesParams,
  ServiceRepository,
} from './service-repository';
import {
  FIXTURE_CATEGORIES,
  FIXTURE_SERVICES,
} from '../fixtures/services.fixture';

export class FixtureServiceRepository implements ServiceRepository {
  private services: ServiceDetail[] = FIXTURE_SERVICES;
  private categories: Category[] = FIXTURE_CATEGORIES;

  private isPublic(service: ServiceDetail): boolean {
    return (
      service.publicationStatus === 'published' &&
      service.verificationStatus === 'verified'
    );
  }

  async searchServices(params: SearchParams): Promise<SearchResult[]> {
    const validated = searchQuerySchema.parse(params);
    const limit = validated.limit || 10;

    const publicServices = this.services.filter(
      (s) =>
        this.isPublic(s) &&
        (!validated.categoryId || s.category.id === validated.categoryId)
    );

    const matches: SearchResult[] = [];
    const seenServiceIds = new Set<string>();

    for (const service of publicServices) {
      const match = scoreService(service, validated.query);
      if (match && !seenServiceIds.has(service.id)) {
        seenServiceIds.add(service.id);
        matches.push({
          serviceId: service.id,
          slug: service.slug,
          name: service.name,
          nameNormalized: service.nameNormalized,
          summary: service.summary,
          categoryName: service.category.name,
          matchType: match.matchType,
          score: match.score,
          matchedAlias: match.matchedAlias,
        });
      }
    }

    const sorted = sortSearchResults(matches);
    return sorted.slice(0, limit);
  }

  async getServiceBySlug(slug: string): Promise<ServiceDetail | null> {
    const service = this.services.find(
      (s) => s.slug === slug && this.isPublic(s)
    );
    if (!service) return null;

    // Attach verified source reference to each cancellation step with domain validation
    const stepsWithSources = service.steps.map((step) => {
      if (!step.sourceReferenceId) return step;
      const source = service.sources.find(
        (src) => src.id === step.sourceReferenceId && src.serviceId === service.id
      );
      return {
        ...step,
        source: source || null,
      };
    });

    return {
      ...service,
      steps: stepsWithSources,
    };
  }

  async listPublishedServices(
    params?: ListPublishedServicesParams
  ): Promise<ServiceSummary[]> {
    let list = this.services.filter(this.isPublic);

    if (params?.categoryId) {
      list = list.filter((s) => s.category.id === params.categoryId);
    }

    if (params?.limit) {
      list = list.slice(0, params.limit);
    }

    return list.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      nameNormalized: s.nameNormalized,
      summary: s.summary,
      category: s.category,
      publicationStatus: s.publicationStatus,
      verificationStatus: s.verificationStatus,
      cancellationChannel: s.cancellationChannel,
      lastVerifiedAt: s.lastVerifiedAt,
    }));
  }

  async listIndexableServices(): Promise<IndexableService[]> {
    return this.services
      .filter(this.isPublic)
      .map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        lastVerifiedAt: s.lastVerifiedAt,
        updatedAt: s.lastVerifiedAt || new Date(),
      }));
  }

  async listCategories(): Promise<Category[]> {
    return this.categories;
  }
}
