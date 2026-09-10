/**
 * Search and text normalization utilities.
 */

/**
 * Normalizes input search text for consistent deterministic indexing and matching.
 * - Trims leading/trailing whitespace
 * - Collapses consecutive whitespace into a single space
 * - Converts to lower case
 * - Strips control characters
 */
export function normalizeSearchText(text: string): string {
  if (!text) return '';

  return text
    .trim()
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control characters
    .replace(/\s+/g, ' ')                          // collapse repeated whitespace
    .toLowerCase();
}

/**
 * Normalizes Swedish characters (å -> a, ä -> a, ö -> o, é -> e) for fuzzy/accent-insensitive comparisons.
 */
export function normalizeSwedishAccents(text: string): string {
  const normalized = normalizeSearchText(text);

  return normalized
    .replace(/[åäàáâã]/g, 'a')
    .replace(/[öòóôõ]/g, 'o')
    .replace(/[éèêë]/g, 'e')
    .replace(/[üùúû]/g, 'u');
}

/**
 * Generates a URL-safe slug from a given string.
 */
export function slugify(text: string): string {
  return normalizeSearchText(text)
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
