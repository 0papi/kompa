import { BaseService } from "./base.service";
import { userPreferences, NewUserPreferences, UserPreferences } from "@/models/user-preferences.model";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { UpdateUserPreferencesType } from "@/schemas/user-preferences.schema";

export class UserPreferencesService extends BaseService<typeof userPreferences> {
  constructor() {
    super(userPreferences);
  }

  /**
   * Get user preferences by user ID
   */
  async getByUserId(userId: string): Promise<UserPreferences | undefined> {
    return this.findOne(eq(userPreferences.userId, userId));
  }

  /**
   * Create or update user preferences
   */
  async upsert(
    userId: string,
    data: UpdateUserPreferencesType,
  ): Promise<UserPreferences> {
    // Check if preferences already exist
    const existing = await this.getByUserId(userId);

    if (existing) {
      // Update existing preferences
      const [updated] = await db
        .update(userPreferences)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return updated;
    }

    // Create new preferences
    return this.create<NewUserPreferences, UserPreferences>({
      userId,
      ...data,
    });
  }

  /**
   * Delete user preferences
   */
  async deleteByUserId(userId: string): Promise<boolean> {
    const result = await db
      .delete(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .returning();

    return result.length > 0;
  }
}
