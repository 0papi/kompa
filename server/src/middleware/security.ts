import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "../config/env";
import { logger } from "../config/logger";

export const helmetMiddleware = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
	hsts: {
		maxAge: 31536000,
		includeSubDomains: true,
		preload: true,
	},
});

export const rateLimiter = rateLimit({
	windowMs: env.RATE_LIMIT_WINDOW_MS,
	max: env.RATE_LIMIT_MAX_REQUESTS,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_req, res) => {
		logger.warn("Rate limit exceeded", {
			ip: _req.ip,
			path: _req.path,
		});

		res.status(429).json({
			success: false,
			error: {
				message: "Too many requests, please try again later",
				code: "RATE_LIMIT_EXCEEDED",
			},
		});
	},
});

// More lenient rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // 20 requests per 15 minutes
	standardHeaders: true,
	legacyHeaders: false,
	handler: (_req, res) => {
		logger.warn("Auth rate limit exceeded", {
			ip: _req.ip,
			path: _req.path,
		});

		res.status(429).json({
			success: false,
			error: {
				message: "Too many authentication attempts, please try again later",
				code: "AUTH_RATE_LIMIT_EXCEEDED",
			},
		});
	},
});
