import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '@/db';
import * as schema from '@/db/schema';
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

export class PostgresServiceRepository implements ServiceRepository {
  async searchServices(params: SearchParams): Promise<SearchResult[]> {
    const validated = searchQuerySchema.parse(params);
    const limit = validated.limit || 10;
    const db = getDb();

    // Query published and verified services matching category if provided
    const baseConditions = [
      eq(schema.services.publicationStatus, 'published'),
      eq(schema.services.verificationStatus, 'verified'),
    ];

    if (validated.categoryId) {
      baseConditions.push(eq(schema.services.categoryId, validated.categoryId));
    }

    // Use parameterized FTS / Trigram candidate retrieval in PostgreSQL
    const rows = await db
      .select({
        service: schema.services,
        category: schema.categories,
      })
      .from(schema.services)
      .innerJoin(
        schema.categories,
        eq(schema.services.categoryId, schema.categories.id)
      )
      .where(
        and(
          ...baseConditions,
          sql`(
            ${schema.services.nameNormalized} ILIKE ${'%' + validated.query + '%'}
            OR ${schema.services.summary} ILIKE ${'%' + validated.query + '%'}
            OR (${schema.services.searchDocument} @@ websearch_to_tsquery('swedish', ${validated.query}))
            OR EXISTS (
              SELECT 1 FROM ${schema.serviceAliases} sa
              WHERE sa.service_id = ${schema.services.id}
              AND sa.alias_normalized ILIKE ${'%' + validated.query + '%'}
            )
          )`
        )
      );

    if (rows.length === 0) {
      return [];
    }

    // Load aliases for all candidates to compute exact ranking scores
    const serviceIds = rows.map((r) => r.service.id);
    const aliases = await db
      .select()
      .from(schema.serviceAliases)
      .where(
        sql`${schema.serviceAliases.serviceId} IN (${sql.join(
          serviceIds.map((id) => sql`${id}`),
          sql`, `
        )})`
      );

    const matches: SearchResult[] = [];
    const seenServiceIds = new Set<string>();

    for (const { service, category } of rows) {
      const serviceAliases = aliases.filter((a) => a.serviceId === service.id);

      const serviceDetail: ServiceDetail = {
        id: service.id,
        slug: service.slug,
        name: service.name,
        nameNormalized: service.nameNormalized,
        summary: service.summary,
        category: {
          id: category.id,
          slug: category.slug,
          name: category.name,
          description: category.description,
        },
        publicationStatus: service.publicationStatus,
        verificationStatus: service.verificationStatus,
        cancellationChannel: service.cancellationChannel,
        lastVerifiedAt: service.lastVerifiedAt,
        aliases: serviceAliases,
        steps: [],
        prices: [],
        sources: [],
        noticePeriodUnit: service.noticePeriodUnit,
      };

      const match = scoreService(serviceDetail, validated.query);
      if (match && !seenServiceIds.has(service.id)) {
        seenServiceIds.add(service.id);
        matches.push({
          serviceId: service.id,
          slug: service.slug,
          name: service.name,
          nameNormalized: service.nameNormalized,
          summary: service.summary,
          categoryName: category.name,
          matchType: match.matchType,
          score: match.score,
          matchedAlias: match.matchedAlias,
        });
      }
    }

    const sorted = sortSearchResults(matches);
    return sorted.slice(0, limit);
  }

  async getServiceBySlug(
    slug: string,
    options?: import('./service-repository').GetServiceOptions
  ): Promise<ServiceDetail | null> {
    const db = getDb();

    const conditions = [eq(schema.services.slug, slug)];
    if (!options?.includeDrafts) {
      conditions.push(
        eq(schema.services.publicationStatus, 'published'),
        eq(schema.services.verificationStatus, 'verified')
      );
    }

    const [row] = await db
      .select({
        service: schema.services,
        category: schema.categories,
      })
      .from(schema.services)
      .innerJoin(
        schema.categories,
        eq(schema.services.categoryId, schema.categories.id)
      )
      .where(and(...conditions))
      .limit(1);

    if (!row) {
      return null;
    }

    const { service, category } = row;

    const [aliases, steps, prices, sources] = await Promise.all([
      db
        .select()
        .from(schema.serviceAliases)
        .where(eq(schema.serviceAliases.serviceId, service.id)),
      db
        .select()
        .from(schema.cancellationSteps)
        .where(eq(schema.cancellationSteps.serviceId, service.id))
        .orderBy(schema.cancellationSteps.position),
      db
        .select()
        .from(schema.servicePrices)
        .where(eq(schema.servicePrices.serviceId, service.id)),
      db
        .select()
        .from(schema.sourceReferences)
        .where(eq(schema.sourceReferences.serviceId, service.id)),
    ]);

    // Attach verified source reference to steps with cross-service integrity guard
    const stepsWithSources = steps.map((step) => {
      if (!step.sourceReferenceId) return step;
      const source = sources.find(
        (src) => src.id === step.sourceReferenceId && src.serviceId === service.id
      );
      return {
        ...step,
        source: source || null,
      };
    });

    return {
      id: service.id,
      slug: service.slug,
      name: service.name,
      nameNormalized: service.nameNormalized,
      legalName: service.legalName,
      summary: service.summary,
      category: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
      },
      websiteUrl: service.websiteUrl,
      officialCancellationUrl: service.officialCancellationUrl,
      cancellationChannel: service.cancellationChannel,
      noticePeriodValue: service.noticePeriodValue,
      noticePeriodUnit: service.noticePeriodUnit,
      bindingNotes: service.bindingNotes,
      confirmationNotes: service.confirmationNotes,
      publicationStatus: service.publicationStatus,
      verificationStatus: service.verificationStatus,
      lastVerifiedAt: service.lastVerifiedAt,
      nextReviewAt: service.nextReviewAt,
      aliases,
      steps: stepsWithSources,
      prices,
      sources,
    };
  }

  async listPublishedServices(
    params?: ListPublishedServicesParams
  ): Promise<ServiceSummary[]> {
    const db = getDb();

    const conditions = [
      eq(schema.services.publicationStatus, 'published'),
      eq(schema.services.verificationStatus, 'verified'),
    ];

    if (params?.categoryId) {
      conditions.push(eq(schema.services.categoryId, params.categoryId));
    }

    const baseQuery = db
      .select({
        service: schema.services,
        category: schema.categories,
      })
      .from(schema.services)
      .innerJoin(
        schema.categories,
        eq(schema.services.categoryId, schema.categories.id)
      )
      .where(and(...conditions))
      .orderBy(schema.services.nameNormalized);

    const rows = params?.limit
      ? await baseQuery.limit(params.limit)
      : await baseQuery;

    return rows.map(({ service, category }) => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      nameNormalized: service.nameNormalized,
      summary: service.summary,
      category: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
      },
      publicationStatus: service.publicationStatus,
      verificationStatus: service.verificationStatus,
      cancellationChannel: service.cancellationChannel,
      lastVerifiedAt: service.lastVerifiedAt,
    }));
  }

  async listIndexableServices(): Promise<IndexableService[]> {
    const db = getDb();

    const rows = await db
      .select({
        id: schema.services.id,
        slug: schema.services.slug,
        name: schema.services.name,
        lastVerifiedAt: schema.services.lastVerifiedAt,
        updatedAt: schema.services.updatedAt,
      })
      .from(schema.services)
      .where(
        and(
          eq(schema.services.publicationStatus, 'published'),
          eq(schema.services.verificationStatus, 'verified')
        )
      );

    return rows;
  }

  async listCategories(): Promise<Category[]> {
    const db = getDb();
    return db.select().from(schema.categories).orderBy(schema.categories.name);
  }
}
