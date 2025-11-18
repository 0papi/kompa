import { env } from "@/config/env";
import { qstashClient } from "./qstash";

export async function scheduleQueueProcessor() {
  await qstashClient.publish({
    url: `${env.BACKEND_URL}/api/v1/process-queue`,
    cron: "*/1 * * * *", 
    retries: 3,
  });
}
