import { describe, it, expect } from 'vitest';
import { formatSwedishDate } from './dates';

describe('formatSwedishDate', () => {
  it('formats dates in Swedish long format', () => {
    const date = new Date('2026-03-15T12:00:00Z');
    const formatted = formatSwedishDate(date, 'long');
    expect(formatted).toContain('15');
    expect(formatted).toContain('mars');
    expect(formatted).toContain('2026');
  });

  it('formats dates in Swedish short format', () => {
    const date = new Date('2026-03-15T12:00:00Z');
    const formatted = formatSwedishDate(date, 'short');
    expect(formatted).toBe('2026-03-15');
  });

  it('returns empty string for invalid date input', () => {
    expect(formatSwedishDate('invalid-date')).toBe('');
  });
});
