/**
 * Currency formatting and integer minor units calculations supporting multi-currency.
 */

export type CurrencyCode =
  | 'SEK'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'NOK'
  | 'DKK';

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  name: string;
  symbol: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'SEK', symbol: 'kr', label: 'SEK (kr)', name: 'Svensk krona', locale: 'sv-SE' },
  { code: 'USD', symbol: '$', label: 'USD ($)', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)', name: 'British Pound', locale: 'en-GB' },
  { code: 'NOK', symbol: 'kr', label: 'NOK (kr)', name: 'Norsk krone', locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', label: 'DKK (kr)', name: 'Dansk krone', locale: 'da-DK' },
];

export interface FormatMoneyOptions {
  currency?: CurrencyCode;
  includeDecimals?: boolean;
  interval?: 'month' | 'year';
  inMinor?: boolean;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(locale: string, currency: CurrencyCode, includeDecimals: boolean): Intl.NumberFormat {
  const cacheKey = `${locale}-${currency}-${includeDecimals}`;
  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    });
    formatterCache.set(cacheKey, formatter);
  }
  return formatter;
}

/**
 * Formats an amount given in integer minor units or standard major units for a given currency.
 */
export function formatMoney(
  amount: number,
  options?: FormatMoneyOptions
): string {
  const currencyCode = options?.currency || 'SEK';
  const currencyConfig =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ||
    SUPPORTED_CURRENCIES[0];

  if (!Number.isFinite(amount)) {
    const zeroFormatter = getFormatter(currencyConfig.locale, currencyConfig.code, false);
    return zeroFormatter.format(0);
  }

  const value = options?.inMinor ? amount / 100 : amount;
  const formatter = getFormatter(
    currencyConfig.locale,
    currencyConfig.code,
    Boolean(options?.includeDecimals)
  );
  const formatted = formatter.format(value);

  if (options?.interval === 'month') {
    return `${formatted}/mo`;
  }
  if (options?.interval === 'year') {
    return `${formatted}/yr`;
  }

  return formatted;
}

/**
 * Backwards compatible helper for SEK currency formatting.
 */
export function formatMoneySEK(
  amount: number,
  options?: FormatMoneyOptions
): string {
  return formatMoney(amount, { ...options, currency: 'SEK' });
}

/**
 * Safely parses a user-entered amount (string) into integer minor units (cents/öre/pence).
 * Supports both comma (,) and dot (.) as decimal separators without floating point precision issues.
 * Strips common currency symbols ($, €, £, kr, etc.) and currency codes.
 * Returns null for negative, invalid, or unreasonably large values (> 10,000,000).
 */
export function parseAmountToMinor(input: string): number | null {
  if (!input || typeof input !== 'string') return null;

  // Clean whitespace, currency codes, and symbols
  const cleaned = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/kr|sek|eur|usd|gbp|nok|dkk|:-|[$€£]/gi, '');

  if (!cleaned) return null;

  // Match positive integer or decimal numbers with 1 or 2 decimal digits only
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

/**
 * Backwards compatible helper for parsing SEK.
 */
export function parseSEKToMinor(input: string): number | null {
  return parseAmountToMinor(input);
}

export interface SavingsProjection {
  monthlyMinor: number;
  yearlyMinor: number;
  fiveYearMinor: number;
}

/**
 * Computes deterministic 1-year and 5-year savings projections in integer minor units.
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
