ALTER TABLE "comments" RENAME COLUMN "user_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_users_firebase_uid_fk";
--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "author_id" SET DATA TYPE uuid USING author_id::uuid;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "related_to_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "related_to_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;