CREATE TYPE "public"."status" AS ENUM('PENDING', 'SUCCESS', 'FAILED', 'ABANDONED');--> statement-breakpoint
CREATE TABLE "payment_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" uuid NOT NULL,
	"action" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"message" text,
	"response_code" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" "status" NOT NULL,
	"email" text NOT NULL,
	"user_id" uuid NOT NULL,
	"reference" text NOT NULL,
	"metadata" jsonb NOT NULL,
	"paystack_authorization_code" text NOT NULL,
	"payment_gateway_response" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_logs" ADD CONSTRAINT "payment_logs_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_logs_transaction_id" ON "payment_logs" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_logs_action" ON "payment_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_logs_status" ON "payment_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_logs_created_at" ON "payment_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_transaction_action" ON "payment_logs" USING btree ("transaction_id","action");--> statement-breakpoint
CREATE INDEX "idx_logs_transaction_created_at" ON "payment_logs" USING btree ("transaction_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_logs_status_created_at" ON "payment_logs" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_reference" ON "transactions" USING btree ("reference");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_unique_authorization_code" ON "transactions" USING btree ("paystack_authorization_code");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_status" ON "transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_email" ON "transactions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_currency" ON "transactions" USING btree ("currency");--> statement-breakpoint
CREATE INDEX "idx_user_status" ON "transactions" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_status_created_at" ON "transactions" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "idx_user_created_at" ON "transactions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_created_at" ON "transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_updated_at" ON "transactions" USING btree ("updated_at");