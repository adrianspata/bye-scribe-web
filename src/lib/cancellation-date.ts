import { NoticePeriodUnit } from '@/features/services/types';

/**
 * Parses a YYYY-MM-DD calendar date string safely without timezone/DST drift.
 */
export function parseCalendarDate(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10); // 1-12
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/**
 * Returns the number of days in a given year and month (1-12).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Calculates the latest recommended cancellation notice date to ensure termination before the target date.
 */
export function calculateRecommendedNoticeDate(
  targetDateStr: string,
  noticePeriodValue: number | null | undefined,
  noticePeriodUnit: NoticePeriodUnit
): string | null {
  const parsed = parseCalendarDate(targetDateStr);
  if (!parsed) return null;

  const value = noticePeriodValue ?? 0;
  if (value < 0) return null;

  if (noticePeriodUnit === 'days') {
    const date = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
    date.setUTCDate(date.getUTCDate() - value);
    return date.toISOString().split('T')[0];
  }

  if (noticePeriodUnit === 'calendar_months') {
    let targetYear = parsed.year;
    let targetMonth = parsed.month - value;

    while (targetMonth < 1) {
      targetMonth += 12;
      targetYear -= 1;
    }

    const maxDays = getDaysInMonth(targetYear, targetMonth);
    const targetDay = Math.min(parsed.day, maxDays);

    const monthStr = targetMonth.toString().padStart(2, '0');
    const dayStr = targetDay.toString().padStart(2, '0');
    return `${targetYear}-${monthStr}-${dayStr}`;
  }

  return null;
}
