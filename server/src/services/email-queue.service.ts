import { Redis } from "@upstash/redis";
import { env } from "@/config/env";
import { emailService } from "./email.service";

interface EmailJob {
  type: string;
  data: any;
  attempt?: number;
}

class EmailQueueService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Upstash Redis credentials not configured");
    }
  }

  /**
   * Add email to queue
   */
  async enqueueEmail<T>(type: string, data: T, delaySeconds: number = 0) {
    console.log("new email enqueued with type:", type, "data:", data);
    const job: EmailJob = {
      type,
      data,
      attempt: 0,
    };

    try {
      // Use immediate queue
      if (delaySeconds > 0) {
        await this.redis.setex(
          `email-queue:${Date.now()}-${Math.random()}`,
          delaySeconds,
          JSON.stringify(job),
        );
      } else {
        await this.redis.lpush("email-queue", JSON.stringify(job));
      }

      console.log(`[Email Queue] Added ${type} email to queue`);
      return { success: true };
    } catch (error) {
      console.error("[Email Queue] Failed to add to queue:", error);
      throw error;
    }
  }

  /**
   * Process pending emails (call this periodically or with cron job)
   */
  async processQueue() {
    try {
      const length = await this.redis.llen("email-queue");

      console.log(`[Email Queue] Processing ${length} pending emails`);

      if (length === 0) {
        console.log("[Email Queue] No pending emails");
        return { processed: 0 };
      }

      let processed = 0;

      // Process up to 10 emails at a time
      for (let i = 0; i < Math.min(10, length); i++) {
        const jobJson = await this.redis.rpop("email-queue");

        if (!jobJson) break;

        try {
          const job: EmailJob = JSON.parse(jobJson as string);
          await this.processEmailJob(job);
          processed++;
        } catch (error) {
          console.error("[Email Queue] Failed to process job:", error);
        }
      }

      console.log(`[Email Queue] Processed ${processed} emails`);
      return { processed };
    } catch (error) {
      console.error("[Email Queue] Error processing queue:", error);
      throw error;
    }
  }

  /**
   * Retry failed email
   */
  async retryEmail(type: string, data: any, attempt: number = 0) {
    if (attempt >= 3) {
      console.error(
        `[Email Queue] Max retries reached for ${type} email. Data:`,
        data,
      );
      await this.storeFailedEmail(type, data, attempt);
      return;
    }

    // Exponential backoff: 2s, 8s, 32s
    const delaySeconds = Math.min(1000 * Math.pow(2, attempt), 30000) / 1000;

    console.log(
      `[Email Queue] Retrying ${type} email (attempt ${attempt + 1}/3) with delay ${delaySeconds}s`,
    );

    await this.enqueueEmail(type, data, delaySeconds);
  }

  /**
   * Process individual email job
   */
  private async processEmailJob(job: EmailJob) {
    const { type, data, attempt = 0 } = job;

    try {
      switch (type) {
        case "PURCHASE_RECEIPT":
          await emailService.sendPurchaseReceipt(data);
          break;

        case "PAYOUT_NOTIFICATION":
          await emailService.sendPayoutNotification(data);
          break;

        case "PAYOUT_FAILED":
          await emailService.sendPayoutFailedNotification(
            data.sellerEmail,
            data.sellerName,
            data.reference,
            data.reason,
          );
          break;

        case "WELCOME":
          await emailService.sendWelcomeEmail(
            data.email,
            data.name,
            data.userType,
          );
          break;

        case "VERIFICATION":
          await emailService.sendVerificationEmail(
            data.email,
            data.verificationLink,
            data.name,
          );
          break;

        case "PAYMENT_FAILED":
          await emailService.sendPaymentFailedEmail(
            data.buyerEmail,
            data.listingTitle,
            data.reference,
            data.reason,
          );
          break;

        case "LISTING_PUBLISHED":
          await emailService.sendListingPublishedEmail(
            data.sellerEmail,
            data.listingTitle,
            data.listingUrl,
          );
          break;

        default:
          throw new Error(`Unknown email type: ${type}`);
      }

      console.log(`[Email Queue] Successfully sent ${type} email`);
    } catch (error) {
      console.error(`[Email Queue] Failed to send ${type} email:`, error);
      await this.retryEmail(type, data, (attempt || 0) + 1);
    }
  }

  /**
   * Store failed emails for manual review
   */
  private async storeFailedEmail(type: string, data: any, attempt: number) {
    try {
      const failedEmail = {
        type,
        data,
        attempt,
        failedAt: new Date().toISOString(),
      };

      await this.redis.lpush("email-queue:failed", JSON.stringify(failedEmail));
      await this.redis.expire("email-queue:failed", 2592000); // 30 days

      console.log(
        `[Email Queue] Stored failed ${type} email for manual review`,
      );
    } catch (error) {
      console.error("[Email Queue] Failed to store failed email:", error);
    }
  }

  /**
   * Get queue stats
   */
  async getStats() {
    try {
      const queueLength = await this.redis.llen("email-queue");
      const failedLength = await this.redis.llen("email-queue:failed");

      return {
        pending: queueLength,
        failed: failedLength,
      };
    } catch (error) {
      console.error("[Email Queue] Failed to get stats:", error);
      return { pending: 0, failed: 0 };
    }
  }

  /**
   * Clear queue (for testing)
   */
  async clearQueue() {
    try {
      await this.redis.del("email-queue");
      await this.redis.del("email-queue:failed");
      console.log("[Email Queue] Queue cleared");
    } catch (error) {
      console.error("[Email Queue] Failed to clear queue:", error);
    }
  }
}

export const emailQueueService = new EmailQueueService();
