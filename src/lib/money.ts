/**
 * Swedish currency formatting and integer minor units (öre) calculations.
 */

const sekFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

const sekWithDecimalsFormatter = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export interface FormatMoneyOptions {
  includeDecimals?: boolean;
  interval?: 'month' | 'year';
}

/**
 * Formats an amount given in integer minor units (öre) or standard SEK.
 */
export function formatMoneySEK(
  amount: number,
  options?: FormatMoneyOptions & { inMinor?: boolean }
): string {
  if (!Number.isFinite(amount)) {
    return '0 kr';
  }

  const valueInSEK = options?.inMinor ? amount / 100 : amount;
  const formatter = options?.includeDecimals
    ? sekWithDecimalsFormatter
    : sekFormatter;
  const formatted = formatter.format(valueInSEK);

  if (options?.interval === 'month') {
    return `${formatted}/mån`;
  }
  if (options?.interval === 'year') {
    return `${formatted}/år`;
  }

  return formatted;
}

/**
 * Safely parses a user-entered Swedish amount (string) into integer minor units (öre).
 * Supports both comma (,) and dot (.) as decimal separators without floating point precision issues.
 * Returns null for negative, invalid, or unreasonably large values (> 10,000,000 SEK).
 */
export function parseSEKToMinor(input: string): number | null {
  if (!input || typeof input !== 'string') return null;

  // Clean whitespace and common currency suffixes
  const cleaned = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/kr|sek|:-/gi, '');

  if (!cleaned) return null;

  // Match optional sign and numbers with optional decimal part
  const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;

  const wholeStr = match[1];
  const decimalStr = (match[2] || '').padEnd(2, '0'); // Pad '5' -> '50'

  const whole = parseInt(wholeStr, 10);
  const decimal = parseInt(decimalStr, 10);

  if (isNaN(whole) || isNaN(decimal) || whole > 10_000_000) {
    return null;
  }

  return whole * 100 + decimal;
}

export interface SavingsProjection {
  monthlyMinor: number;
  yearlyMinor: number;
  fiveYearMinor: number;
}

/**
 * Computes deterministic 1-year and 5-year savings projections in integer öre.
 */
export function calculateSavings(
  amountMinor: number,
  interval: 'month' | 'year'
): SavingsProjection {
  if (amountMinor <= 0) {
    return { monthlyMinor: 0, yearlyMinor: 0, fiveYearMinor: 0 };
  }

  if (interval === 'month') {
    const monthlyMinor = amountMinor;
    const yearlyMinor = monthlyMinor * 12;
    const fiveYearMinor = yearlyMinor * 5;
    return { monthlyMinor, yearlyMinor, fiveYearMinor };
  } else {
    const yearlyMinor = amountMinor;
    const monthlyMinor = Math.round(yearlyMinor / 12);
    const fiveYearMinor = yearlyMinor * 5;
    return { monthlyMinor, yearlyMinor, fiveYearMinor };
  }
}
