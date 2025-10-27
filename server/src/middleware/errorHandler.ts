import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { env } from "../config/env";
import type { ApiResponse } from "../types/index";
import { slackService } from "../services/slack.service";

export class AppError extends Error {
	constructor(
		public statusCode: number,
		public code: string,
		message: string,
	) {
		super(message);
		this.name = "AppError";
		Error.captureStackTrace(this, this.constructor);
	}
}

export function errorHandler(
	error: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	logger.error("Error occurred", {
		error: error.message,
		stack: error.stack,
		name: error.name,
	});

	// Log to Slack
	const context = `${req.method} ${req.path}`;
	const additionalData: Record<string, any> = {
		endpoint: `${req.method} ${req.path}`,
		user: (req as any).user?.uid || "Anonymous",
	};

	if (req.body && Object.keys(req.body).length > 0) {
		additionalData.body = JSON.stringify(req.body).substring(0, 500);
	}

	slackService.logError(error, context, additionalData);

	if (error instanceof AppError) {
		const response: ApiResponse = {
			success: false,
			error: {
				message: error.message,
				code: error.code,
			},
		};

		res.status(error.statusCode).json(response);
		return;
	}

	// Handle unexpected errors
	const isDev = env.NODE_ENV === "development";
	const response: ApiResponse = {
		success: false,
		error: {
			message: isDev ? error.message : "Internal server error",
			code: "INTERNAL_ERROR",
			...(isDev && { stack: error.stack }),
		},
	};

	res.status(500).json(response);
}

export function notFoundHandler(_req: Request, res: Response): void {
	const response: ApiResponse = {
		success: false,
		error: {
			message: "Route not found",
			code: "NOT_FOUND",
		},
	};

	res.status(404).json(response);
}
