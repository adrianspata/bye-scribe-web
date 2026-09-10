CREATE EXTENSION IF NOT EXISTS "pg_trgm";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "unaccent";--> statement-breakpoint
CREATE TYPE "public"."billing_interval_enum" AS ENUM('monthly', 'yearly', 'weekly', 'quarterly', 'one_time');--> statement-breakpoint
CREATE TYPE "public"."cancellation_channel_enum" AS ENUM('website', 'app', 'email', 'phone', 'postal_mail', 'in_person', 'reseller', 'multiple', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."feedback_outcome_enum" AS ENUM('successful', 'unsuccessful', 'outdated_info');--> statement-breakpoint
CREATE TYPE "public"."moderation_status_enum" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notice_period_unit_enum" AS ENUM('days', 'calendar_months', 'billing_cycles', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."publication_status_enum" AS ENUM('draft', 'published', 'needs_review', 'archived');--> statement-breakpoint
CREATE TYPE "public"."source_type_enum" AS ENUM('official_terms', 'official_help', 'official_pricing', 'official_contact', 'authority', 'other');--> statement-breakpoint
CREATE TYPE "public"."template_status_enum" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."verification_status_enum" AS ENUM('unverified', 'verified', 'stale');--> statement-breakpoint
CREATE TABLE "cancellation_steps" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"position" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"instruction" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cancellation_steps_position_positive" CHECK ("cancellation_steps"."position" > 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "feedback_submissions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"outcome" "feedback_outcome_enum" NOT NULL,
	"comment" varchar(1000),
	"moderation_status" "moderation_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_templates" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"locale" varchar(10) DEFAULT 'sv' NOT NULL,
	"cancellation_channel" "cancellation_channel_enum" DEFAULT 'unknown' NOT NULL,
	"subject_template" varchar(255) NOT NULL,
	"body_template" text NOT NULL,
	"status" "template_status_enum" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_aliases" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"alias" varchar(255) NOT NULL,
	"alias_normalized" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_prices" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"plan_name" varchar(255) NOT NULL,
	"amount_minor" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'SEK' NOT NULL,
	"billing_interval" "billing_interval_enum" DEFAULT 'monthly' NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_to" timestamp with time zone,
	"source_reference_id" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_prices_amount_minor_positive" CHECK ("service_prices"."amount_minor" >= 0),
	CONSTRAINT "service_prices_valid_range" CHECK ("service_prices"."valid_to" IS NULL OR "service_prices"."valid_from" IS NULL OR "service_prices"."valid_to" >= "service_prices"."valid_from")
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"requested_name" varchar(255) NOT NULL,
	"requested_url" varchar(500),
	"details" varchar(1000),
	"moderation_status" "moderation_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"name" varchar(255) NOT NULL,
	"name_normalized" varchar(255) NOT NULL,
	"legal_name" varchar(255),
	"summary" text,
	"category_id" varchar(64) NOT NULL,
	"website_url" text,
	"official_cancellation_url" text,
	"cancellation_channel" "cancellation_channel_enum" DEFAULT 'unknown' NOT NULL,
	"notice_period_value" integer,
	"notice_period_unit" "notice_period_unit_enum" DEFAULT 'unknown' NOT NULL,
	"binding_notes" text,
	"confirmation_notes" text,
	"publication_status" "publication_status_enum" DEFAULT 'draft' NOT NULL,
	"verification_status" "verification_status_enum" DEFAULT 'unverified' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug"),
	CONSTRAINT "services_notice_period_positive" CHECK ("services"."notice_period_value" >= 0)
);
--> statement-breakpoint
CREATE TABLE "source_references" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"url" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"source_type" "source_type_enum" DEFAULT 'other' NOT NULL,
	"retrieved_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cancellation_steps" ADD CONSTRAINT "cancellation_steps_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_submissions" ADD CONSTRAINT "feedback_submissions_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_aliases" ADD CONSTRAINT "service_aliases_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_source_reference_id_source_references_id_fk" FOREIGN KEY ("source_reference_id") REFERENCES "public"."source_references"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_references" ADD CONSTRAINT "source_references_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cancellation_steps_service_pos_unique" ON "cancellation_steps" USING btree ("service_id","position");--> statement-breakpoint
CREATE INDEX "cancellation_steps_service_id_idx" ON "cancellation_steps" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "feedback_submissions_service_id_idx" ON "feedback_submissions" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "feedback_submissions_status_idx" ON "feedback_submissions" USING btree ("moderation_status");--> statement-breakpoint
CREATE UNIQUE INDEX "message_templates_key_locale_unique" ON "message_templates" USING btree ("key","locale");--> statement-breakpoint
CREATE UNIQUE INDEX "service_aliases_service_alias_unique" ON "service_aliases" USING btree ("service_id","alias_normalized");--> statement-breakpoint
CREATE INDEX "service_aliases_service_id_idx" ON "service_aliases" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_aliases_alias_norm_idx" ON "service_aliases" USING btree ("alias_normalized");--> statement-breakpoint
CREATE INDEX "service_aliases_alias_trgm_idx" ON "service_aliases" USING gin ("alias_normalized" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "service_prices_service_id_idx" ON "service_prices" USING btree ("service_id");--> statement-breakpoint
CREATE INDEX "service_prices_source_ref_idx" ON "service_prices" USING btree ("source_reference_id");--> statement-breakpoint
CREATE INDEX "service_requests_status_idx" ON "service_requests" USING btree ("moderation_status");--> statement-breakpoint
CREATE INDEX "services_slug_idx" ON "services" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "services_category_id_idx" ON "services" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "services_status_idx" ON "services" USING btree ("publication_status","verification_status");--> statement-breakpoint
CREATE INDEX "services_name_normalized_idx" ON "services" USING btree ("name_normalized");--> statement-breakpoint
CREATE INDEX "services_name_trgm_idx" ON "services" USING gin ("name_normalized" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "source_references_service_id_idx" ON "source_references" USING btree ("service_id");