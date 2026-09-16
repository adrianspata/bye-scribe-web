import { describe, it, expect } from 'vitest';
import {
  formatMoneySEK,
  parseSEKToMinor,
  calculateSavings,
} from './money';

describe('formatMoneySEK', () => {
  it('formats whole numbers in SEK format', () => {
    const formatted = formatMoneySEK(149);
    expect(formatted.replace(/\s+/g, ' ')).toContain('149 kr');
  });

  it('formats thousands with space separation', () => {
    const formatted = formatMoneySEK(1299);
    expect(formatted.replace(/\u00a0/g, ' ')).toBe('1 299 kr');
  });

  it('handles monthly intervals', () => {
    const formatted = formatMoneySEK(99, { interval: 'month' });
    expect(formatted.replace(/\u00a0/g, ' ')).toBe('99 kr/mo');
  });

  it('formats minor units (öre) properly', () => {
    const formatted = formatMoneySEK(14950, { inMinor: true, includeDecimals: true });
    expect(formatted.replace(/\u00a0/g, ' ')).toBe('149,50 kr');
  });
});

describe('parseSEKToMinor', () => {
  it('parses integer SEK into öre', () => {
    expect(parseSEKToMinor('149')).toBe(14900);
    expect(parseSEKToMinor('149 kr')).toBe(14900);
    expect(parseSEKToMinor('1 299 SEK')).toBe(129900);
  });

  it('parses comma decimals safely without floating point drift', () => {
    expect(parseSEKToMinor('149,50')).toBe(14950);
    expect(parseSEKToMinor('19,99')).toBe(1999);
    expect(parseSEKToMinor('0,5')).toBe(50);
  });

  it('parses dot decimals safely', () => {
    expect(parseSEKToMinor('149.50')).toBe(14950);
    expect(parseSEKToMinor('99.9')).toBe(9990);
  });

  it('rejects negative, invalid, or unreasonably large values', () => {
    expect(parseSEKToMinor('-100')).toBeNull();
    expect(parseSEKToMinor('abc')).toBeNull();
    expect(parseSEKToMinor('')).toBeNull();
    expect(parseSEKToMinor('100000000')).toBeNull();
  });
});

describe('calculateSavings', () => {
  it('calculates monthly to 1-year and 5-year savings deterministically in minor units', () => {
    // 149 kr/month = 14900 öre
    const savings = calculateSavings(14900, 'month');
    expect(savings.monthlyMinor).toBe(14900);
    expect(savings.yearlyMinor).toBe(14900 * 12); // 178800 öre = 1788 kr
    expect(savings.fiveYearMinor).toBe(14900 * 12 * 5); // 894000 öre = 8940 kr
  });

  it('calculates yearly to monthly and 5-year savings', () => {
    // 1200 kr/year = 120000 öre
    const savings = calculateSavings(120000, 'year');
    expect(savings.yearlyMinor).toBe(120000);
    expect(savings.monthlyMinor).toBe(10000); // 100 kr/month
    expect(savings.fiveYearMinor).toBe(120000 * 5);
  });
});
