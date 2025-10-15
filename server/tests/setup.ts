import { beforeAll } from "vitest";

// Set test environment variables before any tests run
beforeAll(() => {
	process.env.NODE_ENV = "test";
	process.env.PORT = "3001";
	process.env.CORS_ORIGIN = "http://localhost:3000";
	process.env.DATABASE_URL =
		"postgresql://test:test@localhost:5432/test_db";
	process.env.FIREBASE_PROJECT_ID = "test-project";
	process.env.FIREBASE_CLIENT_EMAIL = "test@test.com";
	process.env.FIREBASE_PRIVATE_KEY = "test-key";
});
