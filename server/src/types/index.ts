import type { Request } from "express";

export interface AuthenticatedUser {
	uid: string;
	email?: string;
	name?: string;
}

export interface AuthenticatedRequest extends Request {
	user?: AuthenticatedUser;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: {
		message: string;
		code?: string;
	};
}
