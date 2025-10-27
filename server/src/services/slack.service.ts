import axios from "axios";

export enum SlackLogLevel {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}

interface SlackField {
  title: string;
  value: string;
  short?: boolean;
}

interface SlackAttachment {
  color?: string;
  title?: string;
  text?: string;
  fields?: SlackField[];
  footer?: string;
  ts?: number;
}

interface SlackMessage {
  text?: string;
  attachments?: SlackAttachment[];
  username?: string;
  icon_emoji?: string;
}

class SlackService {
  private webhookUrl: string | undefined;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
    this.isEnabled = !!this.webhookUrl;
  }

  /**
   * Get color based on log level
   */
  private getColor(level: SlackLogLevel): string {
    const colors: Record<SlackLogLevel, string> = {
      [SlackLogLevel.INFO]: "#36a64f", // Green
      [SlackLogLevel.WARNING]: "#ff9900", // Orange
      [SlackLogLevel.ERROR]: "#ff0000", // Red
      [SlackLogLevel.SUCCESS]: "#00ff00", // Bright green
    };
    return colors[level] || "#808080";
  }

  /**
   * Get emoji based on log level
   */
  private getEmoji(level: SlackLogLevel): string {
    const emojis: Record<SlackLogLevel, string> = {
      [SlackLogLevel.INFO]: ":information_source:",
      [SlackLogLevel.WARNING]: ":warning:",
      [SlackLogLevel.ERROR]: ":x:",
      [SlackLogLevel.SUCCESS]: ":white_check_mark:",
    };
    return emojis[level] || ":speech_balloon:";
  }

  /**
   * Send a message to Slack
   */
  async send(message: SlackMessage): Promise<void> {
    if (!this.isEnabled || !this.webhookUrl) {
      console.log("[Slack] Logging disabled - Message:", message);
      return;
    }

    try {
      await axios.post(this.webhookUrl, message);
    } catch (error) {
      console.error("[Slack] Failed to send message:", error);
    }
  }

  /**
   * Log a simple message
   */
  async log(
    level: SlackLogLevel,
    title: string,
    message: string,
    fields?: SlackField[]
  ): Promise<void> {
    const attachment: SlackAttachment = {
      color: this.getColor(level),
      title: `${this.getEmoji(level)} ${title}`,
      text: message,
      fields,
      footer: "Kompa Backend",
      ts: Math.floor(Date.now() / 1000),
    };

    await this.send({
      attachments: [attachment],
      username: "Kompa Bot",
      icon_emoji: ":robot_face:",
    });
  }

  /**
   * Log an error with stack trace
   */
  async logError(
    error: Error | any,
    context?: string,
    additionalData?: Record<string, any>
  ): Promise<void> {
    const fields: SlackField[] = [
      {
        title: "Error",
        value: error.message || "Unknown error",
        short: false,
      },
    ];

    if (context) {
      fields.push({
        title: "Context",
        value: context,
        short: true,
      });
    }

    if (error.stack) {
      fields.push({
        title: "Stack Trace",
        value: `\`\`\`${error.stack.substring(0, 1000)}\`\`\``,
        short: false,
      });
    }

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        fields.push({
          title: key,
          value: JSON.stringify(value, null, 2).substring(0, 500),
          short: true,
        });
      });
    }

    await this.log(SlackLogLevel.ERROR, "Error Occurred", error.message || "Unknown error", fields);
  }

  /**
   * Log user authentication events
   */
  async logAuth(
    event: "register" | "login" | "logout" | "verify_email",
    userId: string,
    email: string,
    additionalInfo?: Record<string, string>
  ): Promise<void> {
    const eventTitles = {
      register: "New User Registration",
      login: "User Login",
      logout: "User Logout",
      verify_email: "Email Verification",
    };

    const fields: SlackField[] = [
      { title: "User ID", value: userId, short: true },
      { title: "Email", value: email, short: true },
    ];

    if (additionalInfo) {
      Object.entries(additionalInfo).forEach(([key, value]) => {
        fields.push({ title: key, value, short: true });
      });
    }

    await this.log(
      SlackLogLevel.INFO,
      eventTitles[event],
      `User ${email} ${event.replace("_", " ")}`,
      fields
    );
  }

  /**
   * Log listing operations
   */
  async logListing(
    action: "create" | "update" | "delete" | "publish" | "unpublish" | "archive",
    listingId: string,
    userId: string,
    title: string,
    additionalInfo?: Record<string, string>
  ): Promise<void> {
    const actionTitles = {
      create: "New Listing Created",
      update: "Listing Updated",
      delete: "Listing Deleted",
      publish: "Listing Published",
      unpublish: "Listing Unpublished",
      archive: "Listing Archived",
    };

    const fields: SlackField[] = [
      { title: "Listing ID", value: listingId, short: true },
      { title: "User ID", value: userId, short: true },
      { title: "Title", value: title, short: false },
    ];

    if (additionalInfo) {
      Object.entries(additionalInfo).forEach(([key, value]) => {
        fields.push({ title: key, value, short: true });
      });
    }

    await this.log(SlackLogLevel.SUCCESS, actionTitles[action], `Listing "${title}" ${action}d`, fields);
  }

  /**
   * Log payment method changes
   */
  async logPaymentMethod(
    action: "create" | "update" | "delete",
    userId: string,
    methodType: string,
    isPreferred: boolean
  ): Promise<void> {
    const actionTitles = {
      create: "Payment Method Added",
      update: "Payment Method Updated",
      delete: "Payment Method Deleted",
    };

    const fields: SlackField[] = [
      { title: "User ID", value: userId, short: true },
      { title: "Method Type", value: methodType, short: true },
      { title: "Preferred", value: isPreferred ? "Yes" : "No", short: true },
    ];

    await this.log(
      SlackLogLevel.INFO,
      actionTitles[action],
      `User ${userId} ${action}d ${methodType} payment method`,
      fields
    );
  }

  /**
   * Log user preference updates
   */
  async logPreferences(userId: string, changes: Record<string, any>): Promise<void> {
    const fields: SlackField[] = [{ title: "User ID", value: userId, short: true }];

    Object.entries(changes).forEach(([key, value]) => {
      fields.push({
        title: key,
        value: typeof value === "object" ? JSON.stringify(value) : String(value),
        short: true,
      });
    });

    await this.log(
      SlackLogLevel.INFO,
      "User Preferences Updated",
      `User ${userId} updated their preferences`,
      fields
    );
  }

  /**
   * Log bookmark actions
   */
  async logBookmark(action: "create" | "delete", userId: string, listingId: string): Promise<void> {
    const actionTitles = {
      create: "Bookmark Added",
      delete: "Bookmark Removed",
    };

    const fields: SlackField[] = [
      { title: "User ID", value: userId, short: true },
      { title: "Listing ID", value: listingId, short: true },
    ];

    await this.log(
      SlackLogLevel.INFO,
      actionTitles[action],
      `User ${userId} ${action}d bookmark for listing ${listingId}`,
      fields
    );
  }

  /**
   * Log database operations (useful for monitoring)
   */
  async logDatabase(
    operation: "migration" | "seed" | "backup" | "restore",
    status: "started" | "completed" | "failed",
    details?: string
  ): Promise<void> {
    const level = status === "failed" ? SlackLogLevel.ERROR : SlackLogLevel.INFO;
    const emoji = status === "completed" ? ":white_check_mark:" : status === "failed" ? ":x:" : ":hourglass:";

    await this.log(
      level,
      `Database ${operation} ${status}`,
      details || `Database ${operation} operation ${status}`,
      [
        { title: "Operation", value: operation, short: true },
        { title: "Status", value: `${emoji} ${status}`, short: true },
      ]
    );
  }

  /**
   * Log API performance metrics
   */
  async logPerformance(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number
  ): Promise<void> {
    // Only log slow requests (>2 seconds) or errors
    if (duration < 2000 && statusCode < 400) {
      return;
    }

    const level = statusCode >= 500 ? SlackLogLevel.ERROR : statusCode >= 400 ? SlackLogLevel.WARNING : SlackLogLevel.INFO;

    const fields: SlackField[] = [
      { title: "Endpoint", value: endpoint, short: true },
      { title: "Method", value: method, short: true },
      { title: "Duration", value: `${duration}ms`, short: true },
      { title: "Status", value: String(statusCode), short: true },
    ];

    await this.log(level, "API Performance Alert", `Slow or failed request detected`, fields);
  }
}

export const slackService = new SlackService();
