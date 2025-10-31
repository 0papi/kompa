import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { initializeFirebase } from "./config/firebase";
import { helmetMiddleware, rateLimiter } from "./middleware/security";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import healthRouter from "./routes/health";
import userRouter from "./routes/user.routes";
import listingRouter from "./routes/listing.routes";
import listingImageRouter from "./routes/listing-image.routes";
import favoriteRouter from "./routes/favorite.routes";
import commentRouter from "./routes/comments.route";
import reviewRouter from "./routes/review.routes";
import userPreferencesRouter from "./routes/user-preferences.routes";
import paymentMethodsRouter from "./routes/payment-methods.routes";

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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/health", healthRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/preferences", userPreferencesRouter);
app.use("/api/v1/users/payment-methods", paymentMethodsRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1", listingImageRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", reviewRouter);

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
