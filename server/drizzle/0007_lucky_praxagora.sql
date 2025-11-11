CREATE TYPE "public"."payment_log_type" AS ENUM ('PURCHASE', 'PAYOUT');

--> statement-breakpoint
ALTER TABLE "payment_logs"
DROP CONSTRAINT IF EXISTS "payment_logs_transaction_id_purchases_id_fk";

--> statement-breakpoint
ALTER TABLE "payment_logs"
ADD COLUMN "log_type" "payment_log_type" NOT NULL;

--> statement-breakpoint
CREATE INDEX "idx_logs_log_type" ON "payment_logs" USING btree ("log_type");
