import z, { type ZodObject, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { logger } from "@/config/logger";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("request body", req.body);
      const result = await schema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        const formattedErrors = z.treeifyError(result.error)?.properties;

        logger.warn("Validation failed", { errors: formattedErrors });

        return res.status(400).json({
          message: "Validation failed. Please check the provided data.",
          errors: formattedErrors,
        });
      }

      // 💡 Best Practice: Attach the validated data to the request object.
      // This ensures that subsequent handlers use the sanitized, typed data,
      // not the raw, potentially unsafe input from the original request.
      // We can add it to a new property or to `res.locals`.
      res.locals.validatedData = result.data;

      return next();
    } catch (err) {
      logger.error("An unexpected error occurred during validation:", err);

      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: err.flatten().fieldErrors,
        });
      }

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
