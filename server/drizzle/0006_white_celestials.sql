CREATE TYPE "public"."payout_method" AS ENUM('BANK_TRANSFER', 'MOBILE_MONEY', 'WALLET', 'CHEQUE');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "status" NOT NULL,
	"buyer_email" text NOT NULL,
	"listing_id" uuid NOT NULL,
	"buyer_id" uuid NOT NULL,
	"seller_id" uuid NOT NULL,
	"reference" text,
	"metadata" jsonb,
	"paystack_authorization_code" text,
	"payment_gateway_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "payout_status" NOT NULL,
	"payout_method" "payout_method" NOT NULL,
	"bank_account_details" jsonb,
	"mobile_money_details" jsonb,
	"reference" text NOT NULL,
	"processed_by_admin_id" uuid,
	"platform_fee_percentage" numeric(5, 2),
	"platform_fee_amount" integer,
	"net_payout_amount" integer,
	"linked_purchase_ids" jsonb,
	"notes" text,
	"failure_reason" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payouts_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "transactions" CASCADE;--> statement-breakpoint
ALTER TABLE "payment_logs"
DROP CONSTRAINT IF EXISTS "payment_logs_transaction_id_purchases_id_fk";

--> statement-breakpoint
ALTER TABLE "payment_methods" ALTER COLUMN "method_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_method_types";--> statement-breakpoint
CREATE TYPE "public"."payment_method_types" AS ENUM('BANK_TRANSFER', 'MOBILE_MONEY', 'PAYSTACK');--> statement-breakpoint
ALTER TABLE "payment_methods" ALTER COLUMN "method_type" SET DATA TYPE "public"."payment_method_types" USING "method_type"::"public"."payment_method_types";--> statement-breakpoint
ALTER TABLE "payment_methods" ADD COLUMN "last_used_at" timestamp;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_purchase_buyer_id" ON "purchases" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "idx_purchase_seller_id" ON "purchases" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "idx_purchase_listing_id" ON "purchases" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "idx_purchase_status" ON "purchases" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_purchase_unique_reference" ON "purchases" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "idx_purchase_buyer_status" ON "purchases" USING btree ("buyer_id","status");--> statement-breakpoint
CREATE INDEX "idx_purchase_listing_status" ON "purchases" USING btree ("listing_id","status");--> statement-breakpoint
CREATE INDEX "idx_purchase_created_at" ON "purchases" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payout_seller_id" ON "payouts" USING btree ("seller_id");--> statement-breakpoint
CREATE INDEX "idx_payout_status" ON "payouts" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_payout_unique_reference" ON "payouts" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "idx_payout_seller_status" ON "payouts" USING btree ("seller_id","status");--> statement-breakpoint
CREATE INDEX "idx_payout_created_at" ON "payouts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_payout_processed_at" ON "payouts" USING btree ("processed_at");--> statement-breakpoint
ALTER TABLE "payment_logs" ADD CONSTRAINT "payment_logs_transaction_id_purchases_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_payment_methods_user_id" ON "payment_methods" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_method_type" ON "payment_methods" USING btree ("method_type");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_is_preferred" ON "payment_methods" USING btree ("is_preferred");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_user_preferred" ON "payment_methods" USING btree ("user_id","is_preferred");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_user_method" ON "payment_methods" USING btree ("user_id","method_type");--> statement-breakpoint
CREATE INDEX "idx_payment_methods_created_at" ON "payment_methods" USING btree ("created_at");
