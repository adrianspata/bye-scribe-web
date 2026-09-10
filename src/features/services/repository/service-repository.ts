import {
  Category,
  IndexableService,
  ServiceDetail,
  ServiceSummary,
} from '../types';
import { SearchParams, SearchResult } from '@/features/search/types';

export interface ListPublishedServicesParams {
  categoryId?: string;
  limit?: number;
}

export interface ServiceRepository {
  /**
   * Performs ranked Swedish search on published, verified services.
   */
  searchServices(params: SearchParams): Promise<SearchResult[]>;

  /**
   * Retrieves full details for a service by slug.
   * Returns null if not found, not published, or not verified.
   */
  getServiceBySlug(slug: string): Promise<ServiceDetail | null>;

  /**
   * Lists published, verified services with category summaries.
   */
  listPublishedServices(
    params?: ListPublishedServicesParams
  ): Promise<ServiceSummary[]>;

  /**
   * Lists all published, verified services for search engine sitemaps.
   */
  listIndexableServices(): Promise<IndexableService[]>;

  /**
   * Lists available categories.
   */
  listCategories(): Promise<Category[]>;
}
