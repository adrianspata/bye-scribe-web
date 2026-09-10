ALTER TABLE "services" ADD COLUMN "search_document" "tsvector";--> statement-breakpoint
CREATE OR REPLACE FUNCTION services_search_document_update() RETURNS trigger AS $$
BEGIN
  NEW.search_document := setweight(to_tsvector('swedish', coalesce(NEW.name, '')), 'A') || setweight(to_tsvector('swedish', coalesce(NEW.summary, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint
UPDATE "services" SET "search_document" = setweight(to_tsvector('swedish', coalesce("name", '')), 'A') || setweight(to_tsvector('swedish', coalesce("summary", '')), 'B');--> statement-breakpoint
CREATE OR REPLACE TRIGGER services_search_document_trigger BEFORE INSERT OR UPDATE ON services FOR EACH ROW EXECUTE FUNCTION services_search_document_update();--> statement-breakpoint
CREATE INDEX "services_search_document_idx" ON "services" USING gin ("search_document");--> statement-breakpoint
ALTER TABLE "cancellation_steps" ADD COLUMN "source_reference_id" varchar(64);--> statement-breakpoint
ALTER TABLE "cancellation_steps" ADD CONSTRAINT "cancellation_steps_source_reference_id_source_references_id_fk" FOREIGN KEY ("source_reference_id") REFERENCES "public"."source_references"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cancellation_steps_source_ref_idx" ON "cancellation_steps" USING btree ("source_reference_id");