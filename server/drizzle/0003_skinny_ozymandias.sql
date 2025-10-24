ALTER TABLE "listings" DROP CONSTRAINT "listings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "listings" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_firebase_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("firebase_uid") ON DELETE cascade ON UPDATE no action;