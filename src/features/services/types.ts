import { z } from 'zod';

export const publicationStatusSchema = z.enum([
  'draft',
  'published',
  'needs_review',
  'archived',
]);
export type PublicationStatus = z.infer<typeof publicationStatusSchema>;

export const verificationStatusSchema = z.enum(['unverified', 'verified', 'stale']);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const cancellationChannelSchema = z.enum([
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
export type CancellationChannel = z.infer<typeof cancellationChannelSchema>;

export const noticePeriodUnitSchema = z.enum([
  'days',
  'calendar_months',
  'billing_cycles',
  'unknown',
]);
export type NoticePeriodUnit = z.infer<typeof noticePeriodUnitSchema>;

export const sourceTypeSchema = z.enum([
  'official_terms',
  'official_help',
  'official_pricing',
  'official_contact',
  'authority',
  'other',
]);
export type SourceType = z.infer<typeof sourceTypeSchema>;

export const billingIntervalSchema = z.enum([
  'monthly',
  'yearly',
  'weekly',
  'quarterly',
  'one_time',
]);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;

// ----------------------------------------------------------------------
// Domain Entities
// ----------------------------------------------------------------------

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface ServicePrice {
  id: string;
  serviceId: string;
  planName: string;
  amountMinor: number; // Integer öre (e.g. 14900 = 149 kr)
  currency: string;
  billingInterval: BillingInterval;
  validFrom?: Date | null;
  validTo?: Date | null;
  sourceReferenceId?: string | null;
}

export interface SourceReference {
  id: string;
  serviceId: string;
  url: string;
  title: string;
  sourceType: SourceType;
  retrievedAt: Date;
  verifiedAt?: Date | null;
}

export interface CancellationStep {
  id: string;
  serviceId: string;
  sourceReferenceId?: string | null;
  position: number;
  title: string;
  instruction: string;
  source?: SourceReference | null;
}

export interface ServiceAlias {
  id: string;
  serviceId: string;
  alias: string;
  aliasNormalized: string;
}

export interface ServiceSummary {
  id: string;
  slug: string;
  name: string;
  nameNormalized: string;
  summary?: string | null;
  category: Category;
  publicationStatus: PublicationStatus;
  verificationStatus: VerificationStatus;
  cancellationChannel: CancellationChannel;
  lastVerifiedAt?: Date | null;
}

export interface ServiceDetail extends ServiceSummary {
  legalName?: string | null;
  websiteUrl?: string | null;
  officialCancellationUrl?: string | null;
  noticePeriodValue?: number | null;
  noticePeriodUnit: NoticePeriodUnit;
  bindingNotes?: string | null;
  confirmationNotes?: string | null;
  nextReviewAt?: Date | null;
  aliases: ServiceAlias[];
  steps: CancellationStep[];
  prices: ServicePrice[];
  sources: SourceReference[];
}

export interface IndexableService {
  id: string;
  slug: string;
  name: string;
  lastVerifiedAt?: Date | null;
  updatedAt: Date;
}
