import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { env } from "../config/env";
import type { ApiResponse } from "../types/index";

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
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	logger.error("Error occurred", {
		error: error.message,
		stack: error.stack,
		name: error.name,
	});

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
