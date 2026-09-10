import { describe, it, expect } from 'vitest';
import {
  normalizeSearchText,
  normalizeSwedishAccents,
  slugify,
} from './normalization';

describe('normalizeSearchText', () => {
  it('trims whitespace and collapses multiple spaces', () => {
    expect(normalizeSearchText('   Spotify    Premium   ')).toBe('spotify premium');
  });

  it('converts to lowercase', () => {
    expect(normalizeSearchText('NETFLIX')).toBe('netflix');
  });

  it('strips control characters', () => {
    expect(normalizeSearchText('hello\u0000world\u001F')).toBe('helloworld');
  });

  it('preserves Swedish characters in base normalization for display indexing', () => {
    expect(normalizeSearchText('FjällGym Återbetalning Översikt')).toBe(
      'fjällgym återbetalning översikt'
    );
  });
});

describe('normalizeSwedishAccents', () => {
  it('maps Swedish characters to ascii equivalents for typo/accent-insensitive search', () => {
    expect(normalizeSwedishAccents('FjällGym Återbetalning Översikt')).toBe(
      'fjallgym aterbetalning oversikt'
    );
  });
});

describe('slugify', () => {
  it('creates clean URL slugs with Swedish transliteration', () => {
    expect(slugify('Fjäll Gym & Träning! 2026')).toBe('fjall-gym-traning-2026');
  });
});
