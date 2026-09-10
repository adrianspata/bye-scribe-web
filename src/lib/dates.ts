/**
 * Swedish date formatting utilities.
 */

const swedishLongDateFormatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const swedishShortDateFormatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatSwedishDate(
  dateInput: Date | string | number,
  variant: 'long' | 'short' = 'long'
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '';
  }

  return variant === 'short'
    ? swedishShortDateFormatter.format(date)
    : swedishLongDateFormatter.format(date);
}
