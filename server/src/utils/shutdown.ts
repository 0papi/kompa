import type { Server } from "http";
import { logger } from "../config/logger";
import { closeDbConnection } from "../db/index";

export function setupGracefulShutdown(server: Server): void {
	const shutdown = async (signal: string) => {
		logger.info(`${signal} received, starting graceful shutdown`);

		// Stop accepting new connections
		server.close(() => {
			logger.info("HTTP server closed");
		});

		try {
			// Close database connections
			await closeDbConnection();

			logger.info("Graceful shutdown completed");
			process.exit(0);
		} catch (error) {
			logger.error("Error during graceful shutdown", { error });
			process.exit(1);
		}
	};

	// Listen for termination signals
	process.on("SIGTERM", () => shutdown("SIGTERM"));
	process.on("SIGINT", () => shutdown("SIGINT"));

	// Handle uncaught errors
	process.on("uncaughtException", (error: Error) => {
		logger.error("Uncaught exception", { error });
		shutdown("UNCAUGHT_EXCEPTION");
	});

	process.on("unhandledRejection", (reason: unknown) => {
		logger.error("Unhandled rejection", { reason });
		shutdown("UNHANDLED_REJECTION");
	});
}