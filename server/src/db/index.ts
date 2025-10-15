import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config/env";
import { logger } from "../config/logger";
import * as schema from "../models/index";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: env.DB_POOL_MIN,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Handle pool errors
pool.on("error", (err) => {
  logger.error("Unexpected database pool error", { error: err });
});

export const db = drizzle(pool, { schema });

export async function testDbConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    logger.info("Database connection successful");
    return true;
  } catch (error) {
    logger.error("Database connection failed", { error });
    return false;
  }
}

export async function closeDbConnection(): Promise<void> {
  await pool.end();
  logger.info("Database connection pool closed");
}
