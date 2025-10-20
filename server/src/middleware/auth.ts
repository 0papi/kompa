import type { Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { logger } from "../config/logger";
import type { AuthenticatedRequest } from "../types/index";

export async function authenticateUser(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader?.startsWith("Bearer ")) {
			res.status(401).json({
				success: false,
				error: {
					message: "Missing or invalid authorization header",
					code: "UNAUTHORIZED",
				},
			});
			return;
		}

		const token = authHeader.substring(7);

		try {
			const decodedToken = await auth().verifyIdToken(token);

			req.user = {
				uid: decodedToken.uid,
				email: decodedToken.email,
				name: decodedToken.name,
			};

			// Also set res.locals for easy access in controllers
			res.locals.uid = decodedToken.uid;
			res.locals.email = decodedToken.email;
			res.locals.name = decodedToken.name;

			next();
		} catch (error) {
			logger.warn("Invalid Firebase token", { error });
			res.status(401).json({
				success: false,
				error: {
					message: "Invalid or expired token",
					code: "INVALID_TOKEN",
				},
			});
		}
	} catch (error) {
		logger.error("Authentication middleware error", { error });
		res.status(500).json({
			success: false,
			error: {
				message: "Internal server error",
				code: "INTERNAL_ERROR",
			},
		});
	}
}

export function optionalAuth(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): void {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		next();
		return;
	}

	// If auth header is present, use the regular auth middleware
	authenticateUser(req, res, next).catch((error) => {
		logger.error("Optional auth error", { error });
		next();
	});
}
