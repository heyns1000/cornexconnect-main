-- Migration script to add company_id to remaining tables that were missed
-- This script handles the remaining tables that need multi-tenant support

BEGIN;

-- Sales Reps table (should already exist with company_id but adding migration for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'sales_reps' AND column_name = 'company_id') THEN
        ALTER TABLE "sales_reps" ADD COLUMN "company_id" varchar;
        UPDATE "sales_reps" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "sales_reps" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "sales_reps" ADD CONSTRAINT "sales_reps_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_sales_reps_company" ON "sales_reps" ("company_id");
    END IF;
END $$;

-- Hardware Stores table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hardware_stores' AND column_name = 'company_id') THEN
        ALTER TABLE "hardware_stores" ADD COLUMN "company_id" varchar;
        UPDATE "hardware_stores" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "hardware_stores" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "hardware_stores" ADD CONSTRAINT "hardware_stores_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_hardware_stores_company" ON "hardware_stores" ("company_id");
    END IF;
END $$;

-- Route Plans table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'route_plans' AND column_name = 'company_id') THEN
        ALTER TABLE "route_plans" ADD COLUMN "company_id" varchar;
        UPDATE "route_plans" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "route_plans" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "route_plans" ADD CONSTRAINT "route_plans_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_route_plans_company" ON "route_plans" ("company_id");
    END IF;
END $$;

-- Route Stores table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'route_stores' AND column_name = 'company_id') THEN
        -- Note: This table doesn't need company_id as it's linked via route_plans
        -- But adding for consistency if needed
        -- ALTER TABLE "route_stores" ADD COLUMN "company_id" varchar;
        -- UPDATE "route_stores" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        -- ALTER TABLE "route_stores" ALTER COLUMN "company_id" SET NOT NULL;
        -- ALTER TABLE "route_stores" ADD CONSTRAINT "route_stores_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        NULL; -- Do nothing for now
    END IF;
END $$;

-- AI Order Suggestions table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_order_suggestions' AND column_name = 'company_id') THEN
        ALTER TABLE "ai_order_suggestions" ADD COLUMN "company_id" varchar;
        UPDATE "ai_order_suggestions" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "ai_order_suggestions" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "ai_order_suggestions" ADD CONSTRAINT "ai_order_suggestions_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_ai_order_suggestions_company" ON "ai_order_suggestions" ("company_id");
    END IF;
END $$;

-- Store Visits table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'store_visits' AND column_name = 'company_id') THEN
        ALTER TABLE "store_visits" ADD COLUMN "company_id" varchar;
        UPDATE "store_visits" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "store_visits" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "store_visits" ADD CONSTRAINT "store_visits_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_store_visits_company" ON "store_visits" ("company_id");
    END IF;
END $$;

-- Brands table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'company_id') THEN
        ALTER TABLE "brands" ADD COLUMN "company_id" varchar;
        UPDATE "brands" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "brands" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "brands" ADD CONSTRAINT "brands_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_brands_company" ON "brands" ("company_id");
    END IF;
END $$;

-- Factory Setup table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'factory_setups' AND column_name = 'company_id') THEN
        ALTER TABLE "factory_setups" ADD COLUMN "company_id" varchar;
        UPDATE "factory_setups" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "factory_setups" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "factory_setups" ADD CONSTRAINT "factory_setups_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_factory_setups_company" ON "factory_setups" ("company_id");
    END IF;
END $$;

-- AI Insights table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'ai_insights' AND column_name = 'company_id') THEN
        ALTER TABLE "ai_insights" ADD COLUMN "company_id" varchar;
        UPDATE "ai_insights" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "ai_insights" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_ai_insights_company" ON "ai_insights" ("company_id");
    END IF;
END $$;

-- Production Metrics table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'production_metrics' AND column_name = 'company_id') THEN
        ALTER TABLE "production_metrics" ADD COLUMN "company_id" varchar;
        UPDATE "production_metrics" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "production_metrics" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "production_metrics" ADD CONSTRAINT "production_metrics_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_production_metrics_company" ON "production_metrics" ("company_id");
    END IF;
END $$;

-- Factory Recommendations table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'factory_recommendations' AND column_name = 'company_id') THEN
        ALTER TABLE "factory_recommendations" ADD COLUMN "company_id" varchar;
        UPDATE "factory_recommendations" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "factory_recommendations" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "factory_recommendations" ADD CONSTRAINT "factory_recommendations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_factory_recommendations_company" ON "factory_recommendations" ("company_id");
    END IF;
END $$;

-- Automation Rules table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'automation_rules' AND column_name = 'company_id') THEN
        ALTER TABLE "automation_rules" ADD COLUMN "company_id" varchar;
        UPDATE "automation_rules" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "automation_rules" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_automation_rules_company" ON "automation_rules" ("company_id");
    END IF;
END $$;

-- Maintenance Schedules table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'maintenance_schedules' AND column_name = 'company_id') THEN
        ALTER TABLE "maintenance_schedules" ADD COLUMN "company_id" varchar;
        UPDATE "maintenance_schedules" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "maintenance_schedules" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_maintenance_schedules_company" ON "maintenance_schedules" ("company_id");
    END IF;
END $$;

-- Purchase Orders table (should already have it, but adding for safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchase_orders' AND column_name = 'company_id') THEN
        ALTER TABLE "purchase_orders" ADD COLUMN "company_id" varchar;
        UPDATE "purchase_orders" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "purchase_orders" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_purchase_orders_company" ON "purchase_orders" ("company_id");
    END IF;
END $$;

-- Purchase Order Items table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'purchase_order_items' AND column_name = 'company_id') THEN
        ALTER TABLE "purchase_order_items" ADD COLUMN "company_id" varchar;
        UPDATE "purchase_order_items" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "purchase_order_items" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_purchase_order_items_company" ON "purchase_order_items" ("company_id");
    END IF;
END $$;

-- PO Status History table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'po_status_history' AND column_name = 'company_id') THEN
        ALTER TABLE "po_status_history" ADD COLUMN "company_id" varchar;
        UPDATE "po_status_history" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "po_status_history" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "po_status_history" ADD CONSTRAINT "po_status_history_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_po_status_history_company" ON "po_status_history" ("company_id");
    END IF;
END $$;

-- PO Documents table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'po_documents' AND column_name = 'company_id') THEN
        ALTER TABLE "po_documents" ADD COLUMN "company_id" varchar;
        UPDATE "po_documents" SET "company_id" = (SELECT id FROM companies WHERE slug = 'cornex-default' LIMIT 1) WHERE "company_id" IS NULL;
        ALTER TABLE "po_documents" ALTER COLUMN "company_id" SET NOT NULL;
        ALTER TABLE "po_documents" ADD CONSTRAINT "po_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        CREATE INDEX IF NOT EXISTS "idx_po_documents_company" ON "po_documents" ("company_id");
    END IF;
END $$;

COMMIT;