import {
  pgTable,
  pgEnum,
  varchar,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
  check,
  customType,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ----------------------------------------------------------------------
// Custom PostgreSQL Types
// ----------------------------------------------------------------------

export const tsvector = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

// ----------------------------------------------------------------------
// Enums
// ----------------------------------------------------------------------

export const cancellationChannelEnum = pgEnum('cancellation_channel_enum', [
  'website',
  'app',
  'email',
  'phone',
  'postal_mail',
  'in_person',
  'reseller',
  'multiple',
  'unknown',
]);

export const noticePeriodUnitEnum = pgEnum('notice_period_unit_enum', [
  'days',
  'calendar_months',
  'billing_cycles',
  'unknown',
]);

export const publicationStatusEnum = pgEnum('publication_status_enum', [
  'draft',
  'published',
  'needs_review',
  'archived',
]);

export const verificationStatusEnum = pgEnum('verification_status_enum', [
  'unverified',
  'verified',
  'stale',
]);

export const sourceTypeEnum = pgEnum('source_type_enum', [
  'official_terms',
  'official_help',
  'official_pricing',
  'official_contact',
  'authority',
  'other',
]);

export const billingIntervalEnum = pgEnum('billing_interval_enum', [
  'monthly',
  'yearly',
  'weekly',
  'quarterly',
  'one_time',
]);

export const templateStatusEnum = pgEnum('template_status_enum', [
  'draft',
  'active',
  'archived',
]);

export const feedbackOutcomeEnum = pgEnum('feedback_outcome_enum', [
  'successful',
  'unsuccessful',
  'outdated_info',
]);

export const moderationStatusEnum = pgEnum('moderation_status_enum', [
  'pending',
  'approved',
  'rejected',
]);

// ----------------------------------------------------------------------
// 1. Categories
// ----------------------------------------------------------------------

export const categories = pgTable(
  'categories',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('categories_slug_idx').on(table.slug),
  ]
);

// ----------------------------------------------------------------------
// 2. Services
// ----------------------------------------------------------------------

export const services = pgTable(
  'services',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    nameNormalized: varchar('name_normalized', { length: 255 }).notNull(),
    legalName: varchar('legal_name', { length: 255 }),
    summary: text('summary'),
    searchDocument: tsvector('search_document'),
    categoryId: varchar('category_id', { length: 64 })
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    websiteUrl: text('website_url'),
    officialCancellationUrl: text('official_cancellation_url'),
    cancellationChannel: cancellationChannelEnum('cancellation_channel')
      .notNull()
      .default('unknown'),
    noticePeriodValue: integer('notice_period_value'),
    noticePeriodUnit: noticePeriodUnitEnum('notice_period_unit')
      .notNull()
      .default('unknown'),
    bindingNotes: text('binding_notes'),
    confirmationNotes: text('confirmation_notes'),
    publicationStatus: publicationStatusEnum('publication_status')
      .notNull()
      .default('draft'),
    verificationStatus: verificationStatusEnum('verification_status')
      .notNull()
      .default('unverified'),
    lastVerifiedAt: timestamp('last_verified_at', { withTimezone: true }),
    nextReviewAt: timestamp('next_review_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('services_slug_idx').on(table.slug),
    index('services_category_id_idx').on(table.categoryId),
    index('services_status_idx').on(table.publicationStatus, table.verificationStatus),
    index('services_name_normalized_idx').on(table.nameNormalized),
    index('services_search_document_idx').using('gin', table.searchDocument),
    check('services_notice_period_positive', sql`${table.noticePeriodValue} >= 0`),
  ]
);

// ----------------------------------------------------------------------
// 3. Service Aliases
// ----------------------------------------------------------------------

export const serviceAliases = pgTable(
  'service_aliases',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    serviceId: varchar('service_id', { length: 64 })
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    alias: varchar('alias', { length: 255 }).notNull(),
    aliasNormalized: varchar('alias_normalized', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('service_aliases_service_alias_unique').on(
      table.serviceId,
      table.aliasNormalized
    ),
    index('service_aliases_service_id_idx').on(table.serviceId),
    index('service_aliases_alias_norm_idx').on(table.aliasNormalized),
  ]
);

// ----------------------------------------------------------------------
// 4. Source References (Defined before steps and prices that reference it)
// ----------------------------------------------------------------------

export const sourceReferences = pgTable(
  'source_references',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    serviceId: varchar('service_id', { length: 64 })
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    sourceType: sourceTypeEnum('source_type').notNull().default('other'),
    retrievedAt: timestamp('retrieved_at', { withTimezone: true }).notNull(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('source_references_service_id_idx').on(table.serviceId),
  ]
);

// ----------------------------------------------------------------------
// 5. Cancellation Steps (References source_references for step-level provenance)
// ----------------------------------------------------------------------

export const cancellationSteps = pgTable(
  'cancellation_steps',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    serviceId: varchar('service_id', { length: 64 })
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    sourceReferenceId: varchar('source_reference_id', { length: 64 }).references(
      () => sourceReferences.id,
      { onDelete: 'set null' }
    ),
    position: integer('position').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    instruction: text('instruction').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('cancellation_steps_service_pos_unique').on(
      table.serviceId,
      table.position
    ),
    index('cancellation_steps_service_id_idx').on(table.serviceId),
    index('cancellation_steps_source_ref_idx').on(table.sourceReferenceId),
    check('cancellation_steps_position_positive', sql`${table.position} > 0`),
  ]
);

// ----------------------------------------------------------------------
// 6. Service Prices (References source_references for pricing provenance)
// ----------------------------------------------------------------------

export const servicePrices = pgTable(
  'service_prices',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    serviceId: varchar('service_id', { length: 64 })
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    planName: varchar('plan_name', { length: 255 }).notNull(),
    amountMinor: integer('amount_minor').notNull(), // Integer öre (e.g. 14900 = 149 kr)
    currency: varchar('currency', { length: 10 }).notNull().default('SEK'),
    billingInterval: billingIntervalEnum('billing_interval')
      .notNull()
      .default('monthly'),
    validFrom: timestamp('valid_from', { withTimezone: true }),
    validTo: timestamp('valid_to', { withTimezone: true }),
    sourceReferenceId: varchar('source_reference_id', { length: 64 }).references(
      () => sourceReferences.id,
      { onDelete: 'set null' }
    ),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('service_prices_service_id_idx').on(table.serviceId),
    index('service_prices_source_ref_idx').on(table.sourceReferenceId),
    check('service_prices_amount_minor_positive', sql`${table.amountMinor} >= 0`),
    check(
      'service_prices_valid_range',
      sql`${table.validTo} IS NULL OR ${table.validFrom} IS NULL OR ${table.validTo} >= ${table.validFrom}`
    ),
  ]
);

// ----------------------------------------------------------------------
// 7. Message Templates
// ----------------------------------------------------------------------

export const messageTemplates = pgTable(
  'message_templates',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    key: varchar('key', { length: 100 }).notNull(),
    locale: varchar('locale', { length: 10 }).notNull().default('sv'),
    cancellationChannel: cancellationChannelEnum('cancellation_channel')
      .notNull()
      .default('unknown'),
    subjectTemplate: varchar('subject_template', { length: 255 }).notNull(),
    bodyTemplate: text('body_template').notNull(),
    status: templateStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('message_templates_key_locale_unique').on(table.key, table.locale),
  ]
);

// ----------------------------------------------------------------------
// 8. Feedback Submissions
// ----------------------------------------------------------------------

export const feedbackSubmissions = pgTable(
  'feedback_submissions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    serviceId: varchar('service_id', { length: 64 })
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    outcome: feedbackOutcomeEnum('outcome').notNull(),
    comment: varchar('comment', { length: 1000 }),
    moderationStatus: moderationStatusEnum('moderation_status')
      .notNull()
      .default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('feedback_submissions_service_id_idx').on(table.serviceId),
    index('feedback_submissions_status_idx').on(table.moderationStatus),
  ]
);

// ----------------------------------------------------------------------
// 9. Service Requests
// ----------------------------------------------------------------------

export const serviceRequests = pgTable(
  'service_requests',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    requestedName: varchar('requested_name', { length: 255 }).notNull(),
    requestedUrl: varchar('requested_url', { length: 500 }),
    details: varchar('details', { length: 1000 }),
    moderationStatus: moderationStatusEnum('moderation_status')
      .notNull()
      .default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('service_requests_status_idx').on(table.moderationStatus),
  ]
);

// ----------------------------------------------------------------------
// Inferred TypeScript Types
// ----------------------------------------------------------------------

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type ServiceAlias = typeof serviceAliases.$inferSelect;
export type NewServiceAlias = typeof serviceAliases.$inferInsert;

export type CancellationStep = typeof cancellationSteps.$inferSelect;
export type NewCancellationStep = typeof cancellationSteps.$inferInsert;

export type SourceReference = typeof sourceReferences.$inferSelect;
export type NewSourceReference = typeof sourceReferences.$inferInsert;

export type ServicePrice = typeof servicePrices.$inferSelect;
export type NewServicePrice = typeof servicePrices.$inferInsert;

export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type NewMessageTemplate = typeof messageTemplates.$inferInsert;

export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect;
export type NewFeedbackSubmission = typeof feedbackSubmissions.$inferInsert;

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type NewServiceRequest = typeof serviceRequests.$inferInsert;
