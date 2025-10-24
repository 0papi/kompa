import { Router } from "express";
import type { Request, Response } from "express";
import { testDbConnection } from "../db/index";
import type { ApiResponse } from "../types/index";

const router: ReturnType<typeof Router> = Router();

interface HealthResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
}

interface DbHealthResponse extends HealthResponse {
  database: {
    connected: boolean;
  };
}

router.get("/", (_req: Request, res: Response) => {
  const response: ApiResponse<HealthResponse> = {
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  };

  res.status(200).json(response);
});

router.get("/db", async (_req: Request, res: Response) => {
  const dbConnected = await testDbConnection();

  const response: ApiResponse<DbHealthResponse> = {
    success: dbConnected,
    data: {
      status: dbConnected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: dbConnected,
      },
    },
  };

  res.status(dbConnected ? 200 : 503).json(response);
});

export default router;
