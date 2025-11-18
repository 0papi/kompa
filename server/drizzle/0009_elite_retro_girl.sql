CREATE TABLE "provider_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"available_balance" integer DEFAULT 0 NOT NULL,
	"pending_balance" integer DEFAULT 0 NOT NULL,
	"held_balance" integer DEFAULT 0 NOT NULL,
	"base_currency" text DEFAULT 'GHS' NOT NULL,
	"total_gross_earned" integer DEFAULT 0 NOT NULL,
	"total_platform_fee_deducted" integer DEFAULT 0 NOT NULL,
	"total_payout_charges_deducted" integer DEFAULT 0 NOT NULL,
	"total_net_earned" integer DEFAULT 0 NOT NULL,
	"total_withdrawn" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "provider_balances" ADD CONSTRAINT "provider_balances_provider_id_users_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_provider_balances_provider_id_unique" ON "provider_balances" USING btree ("provider_id");