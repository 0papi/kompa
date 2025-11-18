// backend/routes/queue.routes.ts (or .js)
import { Router } from "express";
import { emailQueueService } from "@/services/email-queue.service";

const router: ReturnType<typeof Router> = Router();

// Route that QStash will call
router.post("/process-queue", async (req, res) => {
  try {
    // Verify request is from QStash (recommended)
    // const signature = req.headers['upstash-signature'];
    // if (!signature) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    const result = await emailQueueService.processQueue();
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Queue processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Optional: Get queue stats
router.get("/queue-stats", async (req, res) => {
  try {
    const stats = await emailQueueService.getStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
