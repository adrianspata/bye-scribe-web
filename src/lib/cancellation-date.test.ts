import { describe, it, expect } from 'vitest';
import {
  parseCalendarDate,
  calculateRecommendedNoticeDate,
  getDaysInMonth,
} from './cancellation-date';

describe('cancellation date math', () => {
  it('parses calendar date strings safely', () => {
    expect(parseCalendarDate('2026-03-15')).toEqual({ year: 2026, month: 3, day: 15 });
    expect(parseCalendarDate('invalid')).toBeNull();
  });

  it('determines days in months correctly including leap years', () => {
    expect(getDaysInMonth(2026, 2)).toBe(28); // 2026 is not a leap year
    expect(getDaysInMonth(2024, 2)).toBe(29); // 2024 is a leap year
    expect(getDaysInMonth(2026, 3)).toBe(31);
    expect(getDaysInMonth(2026, 4)).toBe(30);
  });

  it('calculates notice period in days correctly', () => {
    // March 15 minus 14 days = March 1
    const result = calculateRecommendedNoticeDate('2026-03-15', 14, 'days');
    expect(result).toBe('2026-03-01');

    // March 1 minus 5 days = February 24 (2026 is non-leap year with 28 days in Feb)
    const febResult = calculateRecommendedNoticeDate('2026-03-01', 5, 'days');
    expect(febResult).toBe('2026-02-24');
  });

  it('calculates notice period in calendar months with month-end safety', () => {
    // March 31 minus 1 calendar month = February 28 (non-leap year)
    const mar31 = calculateRecommendedNoticeDate('2026-03-31', 1, 'calendar_months');
    expect(mar31).toBe('2026-02-28');

    // March 31 minus 1 calendar month in 2024 (leap year) = February 29
    const leapYearMar31 = calculateRecommendedNoticeDate('2024-03-31', 1, 'calendar_months');
    expect(leapYearMar31).toBe('2024-02-29');

    // May 31 minus 1 month = April 30
    const may31 = calculateRecommendedNoticeDate('2026-05-31', 1, 'calendar_months');
    expect(may31).toBe('2026-04-30');
  });

  it('returns null for unknown or unsupported notice period units', () => {
    expect(calculateRecommendedNoticeDate('2026-03-15', 1, 'unknown')).toBeNull();
    expect(calculateRecommendedNoticeDate('2026-03-15', 1, 'billing_cycles')).toBeNull();
  });
});
