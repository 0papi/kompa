import { authenticateUser } from "@/middleware/auth";
import { initialiseTransactionSchema } from "@/schemas/purchase.schema";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";

const router: ReturnType<typeof Router> = Router();


router.post('/initialise', authenticateUser, validateRequestBody(initialiseTransactionSchema), )
