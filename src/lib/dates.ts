/**
 * Date formatting utilities.
 */

const englishLongDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const englishShortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatDate(
  dateInput: Date | string | number,
  variant: 'long' | 'short' = 'long'
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    return '';
  }

  return variant === 'short'
    ? englishShortDateFormatter.format(date)
    : englishLongDateFormatter.format(date);
}

export const formatSwedishDate = formatDate;
export const formatEnglishDate = formatDate;
