import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { initializeFirebase } from "./config/firebase";
import { helmetMiddleware, rateLimiter } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import userRouter from "./routes/user.routes";

// Initialize Firebase
initializeFirebase();

const app: express.Express = express();

// Security middleware
app.use(helmetMiddleware);
app.use(rateLimiter);

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "API is running",
      version: "1.0.0",
    },
  });
});

// Error handling - must be last
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
