import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { setupGracefulShutdown } from "./utils/shutdown";

const port = env.PORT;

const server = app.listen(port, () => {
	logger.info(`Server is running on port ${port}`, {
		environment: env.NODE_ENV,
		port,
	});
});

// Setup graceful shutdown
setupGracefulShutdown(server);
