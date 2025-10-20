CREATE TYPE "public"."user_roles" AS ENUM('PROVIDER', 'CONSUMER');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."valuation_method" AS ENUM('SALES_COMPARISON', 'COST_APPROACH', 'INCOME_APPROACH', 'MIXED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firebase_uid" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"account_type" "user_roles" DEFAULT 'PROVIDER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_firebase_uid_unique" UNIQUE("firebase_uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"street" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"zip_code" text NOT NULL,
	"county" text,
	"property_category" text NOT NULL,
	"property_type" text NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"price_per_square_foot" numeric(10, 2),
	"bedrooms" integer NOT NULL,
	"bathrooms" numeric(4, 1) NOT NULL,
	"square_feet" integer NOT NULL,
	"lot_size" numeric(10, 2),
	"year_built" integer,
	"stories" integer,
	"garage_spaces" integer,
	"parking_spaces" integer,
	"condition" text NOT NULL,
	"hoa_fees" numeric(10, 2),
	"property_taxes" numeric(10, 2),
	"annual_insurance" numeric(10, 2),
	"valuation_method" "valuation_method" NOT NULL,
	"list_date" text,
	"sale_date" text,
	"days_on_market" integer,
	"features" jsonb DEFAULT '[]'::jsonb,
	"comparable_notes" text,
	"status" "listing_status" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;