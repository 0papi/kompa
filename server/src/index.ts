import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { scheduleQueueProcessor } from "./lib/schedule-queue";
import { setupGracefulShutdown } from "./utils/shutdown";

const port = env.PORT;


const server = app.listen(port, async () => {
	logger.info(`Server is running on port ${port}`, {
		environment: env.NODE_ENV,
		port,
	});

	// Initialize QStash queue processor
	try {
		await scheduleQueueProcessor();
		logger.info("QStash queue processor scheduled successfully");
	} catch (error) {
		logger.error("Failed to schedule QStash processor:", error);
	}
});

// Setup graceful shutdown
setupGracefulShutdown(server);
