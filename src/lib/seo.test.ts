import { describe, it, expect } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

describe('SEO & Robots Configuration', () => {
  it('robots() allows crawling of root and does not disallow search page', () => {
    const config = robots();
    expect(config.rules).toBeDefined();
    if (Array.isArray(config.rules)) {
      const allRule = config.rules.find((r) => r.userAgent === '*');
      expect(allRule?.allow).toBe('/');
      expect(allRule?.disallow).toBeUndefined();
    } else {
      expect(config.rules.allow).toBe('/');
      expect(config.rules.disallow).toBeUndefined();
    }
  });

  it('sitemap() returns safe static routes during build without database', async () => {
    const routes = await sitemap();
    expect(routes.length).toBeGreaterThanOrEqual(3);
    const urls = routes.map((r) => r.url);
    expect(urls).toContain('http://localhost:3000/sv');
    expect(urls).toContain('http://localhost:3000/sv/verktyg/besparingskalkylator');
    expect(urls).toContain('http://localhost:3000/sv/verktyg/uppsagningsmeddelande');

    // Search results or fixtures must never be present in sitemap
    for (const url of urls) {
      expect(url).not.toContain('/sok');
      expect(url).not.toContain('demo');
    }
  });
});
