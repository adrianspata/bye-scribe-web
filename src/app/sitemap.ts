import type { MetadataRoute } from 'next';
import { clientEnv, getDataSourceMode } from '@/lib/env';
import { DatabaseUnconfiguredError } from '@/lib/errors';
import { getServiceRepository } from '@/features/services/repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = clientEnv.NEXT_PUBLIC_SITE_URL;
  const isPostgresMode = getDataSourceMode() === 'postgres';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sv`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/sv/verktyg/besparingskalkylator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sv/verktyg/uppsagningsmeddelande`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Only index verified services from PostgreSQL in production, never fixture mock data
  if (isPostgresMode) {
    try {
      const repo = getServiceRepository();
      const services = await repo.listIndexableServices();
      for (const service of services) {
        routes.push({
          url: `${baseUrl}/sv/tjanster/${service.slug}`,
          lastModified: service.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      }
    } catch (error) {
      // If DB is unconfigured during build, safely return static routes
      if (error instanceof DatabaseUnconfiguredError) {
        return routes;
      }
      throw error;
    }
  }

  return routes;
}
