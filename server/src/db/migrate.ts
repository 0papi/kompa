import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import { logger } from "../config/logger";

async function runMigrations() {
	try {
		logger.info("Running migrations...");
		await migrate(db, { migrationsFolder: "./drizzle" });
		logger.info("Migrations completed successfully");
		await pool.end();
		process.exit(0);
	} catch (error) {
		logger.error("Migration failed", { error });
		await pool.end();
		process.exit(1);
	}
}

runMigrations();
