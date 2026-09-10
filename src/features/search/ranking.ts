import { normalizeSearchText, normalizeSwedishAccents } from '@/lib/normalization';
import { SearchMatchType, SearchResult } from './types';
import { ServiceDetail } from '../services/types';

/**
 * BYESCRIBE SEARCH RANKING WEIGHTS
 * 
 * 1. Exact normalized service name (100)
 * 2. Exact normalized alias (80)
 * 3. Prefix on service name (60)
 * 4. Prefix on alias (50)
 * 5. Full-text / token match in name or summary (30)
 * 6. Trigram / accent-insensitive fuzzy match (10)
 * 
 * SEARCH METHOD DISTINCTIONS:
 * - Exact / Prefix matching: Fast deterministic lookups on stored normalized text (name_normalized, alias_normalized).
 * - Full-Text Search (PostgreSQL tsvector / Swedish stemmer): Matches stemmed words and linguistic variations
 *   in service names (Weight A) and summaries (Weight B) via websearch_to_tsquery.
 * - Trigram similarity (pg_trgm): Typo- and accent-tolerant substring distance fallback.
 */
export const RANKING_WEIGHTS = {
  EXACT_NAME: 100,
  EXACT_ALIAS: 80,
  PREFIX_NAME: 60,
  PREFIX_ALIAS: 50,
  FULL_TEXT: 30,
  FUZZY: 10,
} as const;

export interface ScoredMatch {
  matchType: SearchMatchType;
  score: number;
  matchedAlias?: string | null;
}

/**
 * Computes search score and match type for a single service against a normalized query.
 */
export function scoreService(
  service: ServiceDetail,
  rawQuery: string
): ScoredMatch | null {
  const normQuery = normalizeSearchText(rawQuery);
  const accentQuery = normalizeSwedishAccents(rawQuery);

  if (!normQuery) return null;

  const nameNorm = service.nameNormalized || normalizeSearchText(service.name);
  const nameAccent = normalizeSwedishAccents(service.name);

  // 1. Exact match on service name
  if (nameNorm === normQuery || nameAccent === accentQuery) {
    return {
      matchType: 'exact_name',
      score: RANKING_WEIGHTS.EXACT_NAME,
    };
  }

  // 2. Exact match on alias
  for (const alias of service.aliases || []) {
    const aliasNorm = alias.aliasNormalized || normalizeSearchText(alias.alias);
    const aliasAccent = normalizeSwedishAccents(alias.alias);
    if (aliasNorm === normQuery || aliasAccent === accentQuery) {
      return {
        matchType: 'exact_alias',
        score: RANKING_WEIGHTS.EXACT_ALIAS,
        matchedAlias: alias.alias,
      };
    }
  }

  // 3. Prefix match on service name
  if (nameNorm.startsWith(normQuery) || nameAccent.startsWith(accentQuery)) {
    return {
      matchType: 'prefix_name',
      score: RANKING_WEIGHTS.PREFIX_NAME,
    };
  }

  // 4. Prefix match on alias
  for (const alias of service.aliases || []) {
    const aliasNorm = alias.aliasNormalized || normalizeSearchText(alias.alias);
    const aliasAccent = normalizeSwedishAccents(alias.alias);
    if (aliasNorm.startsWith(normQuery) || aliasAccent.startsWith(accentQuery)) {
      return {
        matchType: 'prefix_alias',
        score: RANKING_WEIGHTS.PREFIX_ALIAS,
        matchedAlias: alias.alias,
      };
    }
  }

  // 5. Full-text / word token containment in name or summary
  const summaryNorm = normalizeSearchText(service.summary || '');
  if (nameNorm.includes(normQuery) || summaryNorm.includes(normQuery)) {
    return {
      matchType: 'full_text',
      score: RANKING_WEIGHTS.FULL_TEXT,
    };
  }

  // 6. Fuzzy / accent-insensitive substring match
  if (nameAccent.includes(accentQuery)) {
    return {
      matchType: 'fuzzy',
      score: RANKING_WEIGHTS.FUZZY,
    };
  }

  return null;
}

/**
 * Deterministically sorts search results by:
 * 1. Score DESC (number)
 * 2. nameNormalized ASC (standard binary ASCII/Unicode code-point comparison)
 * 3. serviceId ASC (standard binary ASCII comparison)
 * 
 * This ensures 100% reproducible tie-break parity regardless of database locale or OS collation.
 */
export function sortSearchResults(results: SearchResult[]): SearchResult[] {
  return [...results].sort((a, b) => {
    // 1. Score descending
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. nameNormalized ascending (deterministic code-point comparison)
    if (a.nameNormalized !== b.nameNormalized) {
      return a.nameNormalized < b.nameNormalized ? -1 : 1;
    }
    // 3. serviceId ascending
    if (a.serviceId !== b.serviceId) {
      return a.serviceId < b.serviceId ? -1 : 1;
    }
    return 0;
  });
}
