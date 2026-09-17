import { describe, it, expect } from 'vitest';
import {
  formatMoney,
  formatMoneySEK,
  parseAmountToMinor,
  parseSEKToMinor,
  calculateSavings,
  SUPPORTED_CURRENCIES,
} from './money';

describe('SUPPORTED_CURRENCIES', () => {
  it('contains the 8 most common currencies', () => {
    expect(SUPPORTED_CURRENCIES).toHaveLength(8);
    const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
    expect(codes).toEqual(['SEK', 'USD', 'EUR', 'GBP', 'NOK', 'DKK', 'CAD', 'AUD']);
  });
});

describe('formatMoney & formatMoneySEK', () => {
  it('formats whole numbers in SEK format by default', () => {
    const formatted = formatMoneySEK(149);
    expect(formatted.replace(/\s+/g, ' ')).toContain('149 kr');
  });

  it('formats thousands with space separation in SEK', () => {
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

  it('formats USD correctly', () => {
    const formatted = formatMoney(1499, { currency: 'USD', inMinor: true });
    expect(formatted).toBe('$15');
    const withDecimals = formatMoney(1499, { currency: 'USD', inMinor: true, includeDecimals: true });
    expect(withDecimals).toBe('$14.99');
  });

  it('formats EUR correctly', () => {
    const formatted = formatMoney(120000, { currency: 'EUR', inMinor: true });
    expect(formatted.replace(/\u00a0/g, ' ')).toContain('1.200');
    expect(formatted).toContain('€');
  });

  it('formats GBP correctly', () => {
    const formatted = formatMoney(5000, { currency: 'GBP', inMinor: true, interval: 'month' });
    expect(formatted).toBe('£50/mo');
  });
});

describe('parseAmountToMinor & parseSEKToMinor', () => {
  it('parses integer amounts into minor units', () => {
    expect(parseAmountToMinor('149')).toBe(14900);
    expect(parseAmountToMinor('149 kr')).toBe(14900);
    expect(parseAmountToMinor('$149')).toBe(14900);
    expect(parseAmountToMinor('€149')).toBe(14900);
    expect(parseAmountToMinor('£149')).toBe(14900);
    expect(parseAmountToMinor('1 299 SEK')).toBe(129900);
  });

  it('parses comma decimals safely without floating point drift', () => {
    expect(parseAmountToMinor('149,50')).toBe(14950);
    expect(parseAmountToMinor('19,99')).toBe(1999);
    expect(parseAmountToMinor('0,5')).toBe(50);
  });

  it('parses dot decimals safely', () => {
    expect(parseAmountToMinor('149.50')).toBe(14950);
    expect(parseAmountToMinor('99.9')).toBe(9990);
  });

  it('rejects negative, invalid, or unreasonably large values', () => {
    expect(parseAmountToMinor('-100')).toBeNull();
    expect(parseAmountToMinor('abc')).toBeNull();
    expect(parseAmountToMinor('')).toBeNull();
    expect(parseAmountToMinor('100000000')).toBeNull();
  });

  it('maintains backwards compatibility with parseSEKToMinor', () => {
    expect(parseSEKToMinor('149 kr')).toBe(14900);
  });
});

describe('calculateSavings', () => {
  it('calculates monthly to 1-year and 5-year savings deterministically in minor units', () => {
    // 149 kr/month = 14900 öre/cents
    const savings = calculateSavings(14900, 'month');
    expect(savings.monthlyMinor).toBe(14900);
    expect(savings.yearlyMinor).toBe(14900 * 12); // 178800 minor = 1788
    expect(savings.fiveYearMinor).toBe(14900 * 12 * 5); // 894000 minor = 8940
  });

  it('calculates yearly to monthly and 5-year savings', () => {
    // 1200 /year = 120000 minor
    const savings = calculateSavings(120000, 'year');
    expect(savings.yearlyMinor).toBe(120000);
    expect(savings.monthlyMinor).toBe(10000); // 100 /month
    expect(savings.fiveYearMinor).toBe(120000 * 5);
  });
});

