import { describe, it, expect } from 'vitest';
import { formatDate, formatEnglishDate } from './dates';

describe('formatDate', () => {
  it('formats dates in English long format', () => {
    const date = new Date('2026-03-15T12:00:00Z');
    const formatted = formatDate(date, 'long');
    expect(formatted).toContain('15');
    expect(formatted).toContain('March');
    expect(formatted).toContain('2026');
  });

  it('formats dates in English short format', () => {
    const date = new Date('2026-03-15T12:00:00Z');
    const formatted = formatEnglishDate(date, 'short');
    expect(formatted).toBe('03/15/2026');
  });

  it('returns empty string for invalid date input', () => {
    expect(formatDate('invalid-date')).toBe('');
  });
});
