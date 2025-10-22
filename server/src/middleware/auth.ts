import type { Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { logger } from "../config/logger";
import type { AuthenticatedRequest } from "../types/index";
import { db } from "../db";
import { users } from "../models/user.model";
import { eq } from "drizzle-orm";

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

	
			const [user] = await db
				.select()
				.from(users)
				.where(eq(users.firebaseUid, decodedToken.uid))
				.limit(1);

			

			if (!user) {
				logger.warn("User not found in database", { firebaseUid: decodedToken.uid });
				res.status(401).json({
					success: false,
					error: {
						message: "User not found",
						code: "USER_NOT_FOUND",
					},
				});
				return;
			}

			req.user = {
				uid: user.id, 
				email: user.email,
				name: user.name!,
			};

		
			res.locals.uid = user.id; 
			res.locals.firebaseUid = decodedToken.uid; 
			res.locals.email = user.email;
			res.locals.name = user.name;

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

export async function optionalAuth(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith("Bearer ")) {
		next();
		return;
	}

	const token = authHeader.substring(7);

	try {
		const decodedToken = await auth().verifyIdToken(token);

		// Fetch user from database using Firebase UID
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.firebaseUid, decodedToken.uid))
			.limit(1);

		if (user) {
			req.user = {
				uid: user.id, // Database UUID
				email: user.email,
				name: user.name!,
			};

			// Set res.locals with database UUID for easy access in controllers
			res.locals.uid = user.id; // Database UUID instead of Firebase UID
			res.locals.firebaseUid = decodedToken.uid; // Keep Firebase UID if needed
			res.locals.email = user.email;
			res.locals.name = user.name;
		}
	} catch (error) {
		logger.warn("Optional auth failed, continuing without auth", { error });
		// Continue without authentication
	}

	next();
}
