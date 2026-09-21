/**
 * Custom error hierarchy for ByeScribe.
 */

export class ByeScribeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ByeScribeError';
  }
}

export class DatabaseUnconfiguredError extends ByeScribeError {
  constructor(message = 'DATABASE_URL is not configured.') {
    super(message);
    this.name = 'DatabaseUnconfiguredError';
  }
}

export class SecurityConfigurationError extends ByeScribeError {
  constructor(message: string) {
    super(message);
    this.name = 'SecurityConfigurationError';
  }
}

export class ServiceNotFoundError extends ByeScribeError {
  constructor(slug: string) {
    super(`Service with slug "${slug}" was not found or is not published.`);
    this.name = 'ServiceNotFoundError';
  }
}

export class InvalidSourceReferenceError extends ByeScribeError {
  constructor(message = 'Source reference does not belong to this service.') {
    super(message);
    this.name = 'InvalidSourceReferenceError';
  }
}

export class CategoryConfigurationError extends ByeScribeError {
  constructor(categorySlug: string, locale: string) {
    super(`Missing localized category configuration for slug "${categorySlug}" in locale "${locale}".`);
    this.name = 'CategoryConfigurationError';
  }
}
