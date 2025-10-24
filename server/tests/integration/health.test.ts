import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../src/app";

// Mock Firebase to prevent initialization errors in tests
vi.mock("../../src/config/firebase", () => ({
	initializeFirebase: vi.fn(),
	auth: () => ({
		verifyIdToken: vi.fn(),
	}),
}));

describe("Health Endpoints", () => {
	describe("GET /health", () => {
		it("should return 200 with health status", async () => {
			const response = await request(app).get("/health");

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				data: {
					status: "healthy",
					uptime: expect.any(Number),
					timestamp: expect.any(String),
				},
			});
		});
	});

	describe("GET /health/db", () => {
		it("should check database connection", async () => {
			// Mock the database connection test
			vi.mock("../../src/db/index", () => ({
				testDbConnection: vi.fn().mockResolvedValue(false),
				db: {},
				pool: {},
			}));

			const response = await request(app).get("/health/db");

			expect(response.body).toMatchObject({
				data: {
					database: {
						connected: expect.any(Boolean),
					},
				},
			});
		});
	});
});

describe("Root Endpoint", () => {
	describe("GET /", () => {
		it("should return 200 with API info", async () => {
			const response = await request(app).get("/");

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				success: true,
				data: {
					message: "API is running",
					version: "1.0.0",
				},
			});
		});
	});
});

describe("404 Handler", () => {
	it("should return 404 for unknown routes", async () => {
		const response = await request(app).get("/unknown-route");

		expect(response.status).toBe(404);
		expect(response.body).toMatchObject({
			success: false,
			error: {
				message: "Route not found",
				code: "NOT_FOUND",
			},
		});
	});
});
