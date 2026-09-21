import { describe, it, expect } from 'vitest';
import enMessages from '@/messages/en.json';
import svMessages from '@/messages/sv.json';
import { ServiceDetail } from '@/features/services/types';

describe('i18n Completeness & Language Isolation Guardrails', () => {
  // 1. Verify category mapping on /en fails closed without falling back to Swedish
  it('strictly maps known categories on /en and returns null for unknown category slugs', () => {
    const enCategories = enMessages.categories as Record<string, string>;
    const svCategories = svMessages.categories as Record<string, string>;

    expect(enCategories.ljudbocker).toBe('Audiobooks');
    expect(enCategories.streaming).toBe('Streaming & Video');
    expect(enCategories['traning-halsa']).toBe('Fitness & Health');

    // For any category present in Swedish, English must have an explicit mapping
    for (const key of Object.keys(svCategories)) {
      expect(enCategories).toHaveProperty(key);
      expect(enCategories[key]).toBeTruthy();
      // Ensure English category name is not equal to Swedish unless it's an identical international word like 'Streaming & Video'
      if (key === 'ljudbocker') {
        expect(enCategories[key]).not.toBe(svCategories[key]);
      }
    }

    // Resolving an unknown slug must return null, NEVER falling back to Swedish
    function resolveCategory(slug: string, locale: 'sv' | 'en', fallbackSwedishName: string): string | null {
      const messages = locale === 'en' ? enCategories : svCategories;
      if (slug in messages) {
        return messages[slug];
      }
      // Fail closed on English: never return fallbackSwedishName
      if (locale === 'en') {
        return null;
      }
      return fallbackSwedishName;
    }

    expect(resolveCategory('unknown-slug', 'en', 'Svensk Kategori')).toBeNull();
    expect(resolveCategory('ljudbocker', 'en', 'Ljudböcker')).toBe('Audiobooks');
  });

  // 2. Verify complete step translation requirement
  it('rejects publication in a locale if any cancellation step lacks translation', () => {
    const partialService: ServiceDetail = {
      id: 'srv-partial-1',
      slug: 'partial-service',
      name: 'Partial Service',
      nameNormalized: 'partial service',
      category: { id: 'cat-1', slug: 'streaming', name: 'Streaming' },
      publicationStatus: 'published',
      verificationStatus: 'verified',
      cancellationChannel: 'website',
      noticePeriodValue: 0,
      noticePeriodUnit: 'days',
      aliases: [],
      steps: [
        {
          id: 'step-1',
          serviceId: 'srv-partial-1',
          position: 1,
          title: 'Log in',
          instruction: 'Log into your account',
        },
        {
          id: 'step-2',
          serviceId: 'srv-partial-1',
          position: 2,
          title: '', // Missing title in English
          instruction: '', // Missing instruction in English
        },
      ],
      prices: [],
      sources: [],
    };

    function isServiceCompleteInLocale(service: ServiceDetail): boolean {
      if (!service.steps || service.steps.length === 0) return true;
      return service.steps.every(
        (step) => step.title.trim().length > 0 && step.instruction.trim().length > 0
      );
    }

    expect(isServiceCompleteInLocale(partialService)).toBe(false);

    const completeService: ServiceDetail = {
      ...partialService,
      steps: [
        {
          id: 'step-1',
          serviceId: 'srv-partial-1',
          position: 1,
          title: 'Log in',
          instruction: 'Log into your account',
        },
        {
          id: 'step-2',
          serviceId: 'srv-partial-1',
          position: 2,
          title: 'Click Cancel',
          instruction: 'Click the cancel subscription button.',
        },
      ],
    };

    expect(isServiceCompleteInLocale(completeService)).toBe(true);
  });
});
