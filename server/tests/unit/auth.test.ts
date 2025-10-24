import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response, NextFunction } from "express";
import { authenticateUser } from "../../src/middleware/auth";
import type { AuthenticatedRequest } from "../../src/types/index";

// Mock Firebase auth
vi.mock("../../src/config/firebase", () => ({
	auth: () => ({
		verifyIdToken: vi.fn(),
	}),
}));

describe("Authentication Middleware", () => {
	let mockRequest: Partial<AuthenticatedRequest>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		mockRequest = {
			headers: {},
		};

		mockResponse = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn().mockReturnThis(),
		};

		mockNext = vi.fn();
	});

	it("should return 401 if no authorization header is present", async () => {
		await authenticateUser(
			mockRequest as AuthenticatedRequest,
			mockResponse as Response,
			mockNext,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			success: false,
			error: {
				message: "Missing or invalid authorization header",
				code: "UNAUTHORIZED",
			},
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it("should return 401 if authorization header does not start with Bearer", async () => {
		mockRequest.headers = {
			authorization: "Basic token123",
		};

		await authenticateUser(
			mockRequest as AuthenticatedRequest,
			mockResponse as Response,
			mockNext,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			success: false,
			error: {
				message: "Missing or invalid authorization header",
				code: "UNAUTHORIZED",
			},
		});
		expect(mockNext).not.toHaveBeenCalled();
	});

	it("should call next if token is valid", async () => {
		const { auth } = await import("../../src/config/firebase");
		const mockAuth = auth();

		vi.mocked(mockAuth.verifyIdToken).mockResolvedValue({
			uid: "user123",
			email: "test@example.com",
			name: "Test User",
		} as any);

		mockRequest.headers = {
			authorization: "Bearer valid-token",
		};

		await authenticateUser(
			mockRequest as AuthenticatedRequest,
			mockResponse as Response,
			mockNext,
		);

		expect(mockAuth.verifyIdToken).toHaveBeenCalledWith("valid-token");
		expect(mockRequest.user).toEqual({
			uid: "user123",
			email: "test@example.com",
			name: "Test User",
		});
		expect(mockNext).toHaveBeenCalled();
		expect(mockResponse.status).not.toHaveBeenCalled();
	});

	it("should return 401 if token verification fails", async () => {
		const { auth } = await import("../../src/config/firebase");
		const mockAuth = auth();

		vi.mocked(mockAuth.verifyIdToken).mockRejectedValue(
			new Error("Invalid token"),
		);

		mockRequest.headers = {
			authorization: "Bearer invalid-token",
		};

		await authenticateUser(
			mockRequest as AuthenticatedRequest,
			mockResponse as Response,
			mockNext,
		);

		expect(mockResponse.status).toHaveBeenCalledWith(401);
		expect(mockResponse.json).toHaveBeenCalledWith({
			success: false,
			error: {
				message: "Invalid or expired token",
				code: "INVALID_TOKEN",
			},
		});
		expect(mockNext).not.toHaveBeenCalled();
	});
});
