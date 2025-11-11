import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z
		.string()
		.default("3000")
		.transform((val) => Number(val)),
	CORS_ORIGIN: z.string().url(),

	// Database
	DATABASE_URL: z.string().url(),
	DB_POOL_MIN: z
		.string()
		.default("2")
		.transform((val) => Number(val)),
	DB_POOL_MAX: z
		.string()
		.default("10")
		.transform((val) => Number(val)),

	// Firebase
	FIREBASE_PROJECT_ID: z.string().min(1),
	FIREBASE_PRIVATE_KEY: z.string().min(1),
	FIREBASE_CLIENT_EMAIL: z.string().email(),

	// Cloudinary
	CLOUDINARY_CLOUD_NAME: z.string().min(1),
	CLOUDINARY_API_KEY: z.string().min(1),
	CLOUDINARY_API_SECRET: z.string().min(1),

		// Firebase
	PAYSTACK_SECRET_KEY: z.string().min(1),
	PAYSTACK_PUBLIC_KEY: z.string().min(1),
	PAYSTACK_API_URL: z.url(),


	// Security
	RATE_LIMIT_WINDOW_MS: z
		.string()
		.default("900000")
		.transform((val) => Number(val)), // 15 min
	RATE_LIMIT_MAX_REQUESTS: z
		.string()
		.default("100")
		.transform((val) => Number(val)),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.issues
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("\n");
			throw new Error(`Environment validation failed:\n${missingVars}`);
		}
		throw error;
	}
}

export const env = validateEnv();
