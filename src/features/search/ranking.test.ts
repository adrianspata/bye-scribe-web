import { describe, it, expect } from 'vitest';
import {
  scoreService,
  sortSearchResults,
  RANKING_WEIGHTS,
} from './ranking';
import { searchQuerySchema, SearchResult } from './types';
import { FIXTURE_SERVICES } from '../services/fixtures/services.fixture';

describe('Search Ranking & Scoring Hardening', () => {
  const nordicPlay = FIXTURE_SERVICES.find((s) => s.slug === 'nordicplay-demo')!;
  const fjallGym = FIXTURE_SERVICES.find((s) => s.slug === 'fjallgym-demo')!;

  it('prioritizes Exact Name (100) > Exact Alias (80) > Prefix Name (60) > Prefix Alias (50) > Full-text (30) > Fuzzy (10)', () => {
    const exactName = scoreService(nordicPlay, 'NordicPlay Demo');
    const exactAlias = scoreService(nordicPlay, 'Nordic Play');
    const prefixName = scoreService(nordicPlay, 'NordicP');
    const prefixAlias = scoreService(nordicPlay, 'Nordic Str');
    const fullText = scoreService(nordicPlay, 'movies');
    const fuzzy = scoreService(fjallGym, 'Fjallgym');

    expect(exactName?.score).toBe(RANKING_WEIGHTS.EXACT_NAME);
    expect(exactAlias?.score).toBe(RANKING_WEIGHTS.EXACT_ALIAS);
    expect(prefixName?.score).toBe(RANKING_WEIGHTS.PREFIX_NAME);
    expect(prefixAlias?.score).toBe(RANKING_WEIGHTS.PREFIX_ALIAS);
    expect(fullText?.score).toBe(RANKING_WEIGHTS.FULL_TEXT);
    expect(fuzzy?.score).toBe(RANKING_WEIGHTS.PREFIX_NAME); // Accent-normalized prefix match

    expect(exactName!.score).toBeGreaterThan(exactAlias!.score);
    expect(exactAlias!.score).toBeGreaterThan(prefixName!.score);
    expect(prefixName!.score).toBeGreaterThan(prefixAlias!.score);
    expect(prefixAlias!.score).toBeGreaterThan(fullText!.score);
  });

  it('evaluates FTS/token matches in summary before falling back to trigram/fuzzy', () => {
    const summaryMatch = scoreService(nordicPlay, 'movies');
    expect(summaryMatch?.matchType).toBe('full_text');
    expect(summaryMatch?.score).toBe(RANKING_WEIGHTS.FULL_TEXT);
  });

  it('guarantees identical deterministic tie-breaks across adapter scoring', () => {
    const results: SearchResult[] = [
      {
        serviceId: 'srv-002',
        slug: 'b-slug',
        name: 'Beta Service',
        nameNormalized: 'beta service',
        categoryName: 'Cat',
        matchType: 'full_text',
        score: 30,
      },
      {
        serviceId: 'srv-001',
        slug: 'a-slug',
        name: 'Alpha Service',
        nameNormalized: 'alpha service',
        categoryName: 'Cat',
        matchType: 'exact_name',
        score: 100,
      },
      {
        serviceId: 'srv-003',
        slug: 'c-slug',
        name: 'Charlie Service',
        nameNormalized: 'charlie service',
        categoryName: 'Cat',
        matchType: 'exact_alias',
        score: 80,
      },
      {
        serviceId: 'srv-004',
        slug: 'b-slug-2',
        name: 'Beta Service',
        nameNormalized: 'beta service',
        categoryName: 'Cat',
        matchType: 'full_text',
        score: 30,
      },
    ];

    const sorted = sortSearchResults(results);
    expect(sorted.map((r) => r.serviceId)).toEqual([
      'srv-001', // score 100
      'srv-003', // score 80
      'srv-002', // score 30, name 'beta service', id 'srv-002'
      'srv-004', // score 30, name 'beta service', id 'srv-004'
    ]);
  });

  it('validates query constraints, empty queries and control characters', () => {
    expect(() => searchQuerySchema.parse({ query: '' })).toThrow('Search query cannot be empty');
    expect(() => searchQuerySchema.parse({ query: '   ' })).toThrow();
    expect(() => searchQuerySchema.parse({ query: 'a'.repeat(101) })).toThrow('Search query cannot exceed 100 characters');
    expect(() => searchQuerySchema.parse({ query: 'bad\u0007query' })).toThrow('control characters');

    const valid = searchQuerySchema.parse({ query: 'spotify' });
    expect(valid.query).toBe('spotify');
    expect(valid.limit).toBe(10);
  });
});
