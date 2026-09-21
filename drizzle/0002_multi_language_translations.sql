-- Migration: 0002_multi_language_translations.sql
-- Purpose: Normalizes translations for services and cancellation steps, adds explicit alias locale classification, and preserves existing provider-level metadata.

-- 1. Add locale column to service_aliases (default 'sv' for safety) and explicitly classify existing aliases
ALTER TABLE "service_aliases" ADD COLUMN IF NOT EXISTS "locale" varchar(10) DEFAULT 'sv';
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "service_aliases_locale_idx" ON "service_aliases" USING btree ("locale");
--> statement-breakpoint

-- Explicit classification of existing reviewed aliases:
-- Swedish-specific alias classified as 'sv'
UPDATE "service_aliases"
SET "locale" = 'sv'
WHERE "alias" IN ('BookBeat Sverige');
--> statement-breakpoint

-- Reviewed language-neutral brand alias explicitly classified as NULL (universal)
UPDATE "service_aliases"
SET "locale" = NULL
WHERE "alias" IN ('Book Beat');
--> statement-breakpoint

-- 2. Create service_translations table
CREATE TABLE IF NOT EXISTS "service_translations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"service_id" varchar(64) NOT NULL,
	"locale" varchar(10) NOT NULL,
	"summary" text,
	"binding_notes" text,
	"confirmation_notes" text,
	"publication_status" "publication_status_enum" DEFAULT 'draft' NOT NULL,
	"verification_status" "verification_status_enum" DEFAULT 'unverified' NOT NULL,
	"last_verified_at" timestamp with time zone,
	"next_review_at" timestamp with time zone,
	"search_document" "tsvector",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "service_translations_service_locale_unique" ON "service_translations" USING btree ("service_id","locale");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_translations_status_locale_idx" ON "service_translations" USING btree ("publication_status","verification_status","locale");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "service_translations_search_doc_idx" ON "service_translations" USING gin ("search_document");
--> statement-breakpoint

-- 3. Create cancellation_step_translations table
CREATE TABLE IF NOT EXISTS "cancellation_step_translations" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"step_id" varchar(64) NOT NULL,
	"locale" varchar(10) NOT NULL,
	"title" varchar(255) NOT NULL,
	"instruction" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

ALTER TABLE "cancellation_step_translations" ADD CONSTRAINT "cancellation_step_translations_step_id_cancellation_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."cancellation_steps"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "cancellation_step_translations_step_locale_unique" ON "cancellation_step_translations" USING btree ("step_id","locale");
--> statement-breakpoint

-- 4. Dynamic multi-language FTS trigger function & cross-table sync triggers
CREATE OR REPLACE FUNCTION service_translations_search_document_update() RETURNS trigger AS $$
DECLARE
  v_config regconfig;
  v_service_name text;
  v_aliases text;
BEGIN
  IF NEW.locale = 'sv' THEN
    v_config := 'swedish'::regconfig;
  ELSIF NEW.locale = 'en' THEN
    v_config := 'english'::regconfig;
  ELSE
    v_config := 'simple'::regconfig;
  END IF;

  SELECT s.name INTO v_service_name FROM services s WHERE s.id = NEW.service_id;
  
  -- Filter aliases strictly by locale: match current translation locale or explicitly reviewed language-agnostic NULL
  SELECT COALESCE(string_agg(sa.alias, ' '), '') INTO v_aliases 
  FROM service_aliases sa 
  WHERE sa.service_id = NEW.service_id 
    AND (sa.locale IS NULL OR sa.locale = NEW.locale);

  -- Indexing weights for candidate retrieval:
  -- Weight A: Service Name
  -- Weight B: Aliases + Summary
  NEW.search_document :=
    setweight(to_tsvector(v_config, COALESCE(v_service_name, '')), 'A') ||
    setweight(to_tsvector(v_config, COALESCE(v_aliases, '') || ' ' || COALESCE(NEW.summary, '')), 'B');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE TRIGGER trg_service_translations_search_document
BEFORE INSERT OR UPDATE ON "service_translations"
FOR EACH ROW
EXECUTE FUNCTION service_translations_search_document_update();
--> statement-breakpoint

-- Synchronize search_document when services.name is updated
CREATE OR REPLACE FUNCTION services_sync_search_document() RETURNS trigger AS $$
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE service_translations
    SET updated_at = now()
    WHERE service_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE TRIGGER trg_services_sync_search_document
AFTER UPDATE OF name ON "services"
FOR EACH ROW
EXECUTE FUNCTION services_sync_search_document();
--> statement-breakpoint

-- Synchronize search_document when service_aliases are added, updated or deleted (handling alias transfer between services)
CREATE OR REPLACE FUNCTION service_aliases_sync_search_document() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.service_id IS DISTINCT FROM NEW.service_id THEN
    UPDATE service_translations SET updated_at = now() WHERE service_id = OLD.service_id;
    UPDATE service_translations SET updated_at = now() WHERE service_id = NEW.service_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE service_translations SET updated_at = now() WHERE service_id = OLD.service_id;
  ELSE
    UPDATE service_translations SET updated_at = now() WHERE service_id = NEW.service_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE OR REPLACE TRIGGER trg_service_aliases_sync_search_document
AFTER INSERT OR UPDATE OR DELETE ON "service_aliases"
FOR EACH ROW
EXECUTE FUNCTION service_aliases_sync_search_document();
--> statement-breakpoint

-- 5. Backfill service_translations directly preserving each service's existing status and verification metadata
INSERT INTO "service_translations" (
  "id", "service_id", "locale", "summary", "binding_notes", "confirmation_notes",
  "publication_status", "verification_status", "last_verified_at", "next_review_at"
)
SELECT 
  gen_random_uuid()::text,
  s.id,
  'sv',
  s.summary,
  s.binding_notes,
  s.confirmation_notes,
  s.publication_status,
  s.verification_status,
  s.last_verified_at,
  s.next_review_at
FROM "services" s
ON CONFLICT ("service_id", "locale") DO NOTHING;
--> statement-breakpoint

-- 6. Backfill cancellation_step_translations
INSERT INTO "cancellation_step_translations" (
  "id", "step_id", "locale", "title", "instruction"
)
SELECT 
  gen_random_uuid()::text, cs.id, 'sv', cs.title, cs.instruction
FROM "cancellation_steps" cs
ON CONFLICT ("step_id", "locale") DO NOTHING;
