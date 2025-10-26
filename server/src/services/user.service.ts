import { CreateUserType, UpdateUserType } from "@/schemas/user.schema";
import { users as userTable, User } from "@/models/user.model";
import { BaseService } from "./base.service";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export class UserService extends BaseService<typeof userTable> {
  constructor() {
    super(userTable);
  }

  async createUser(payload: CreateUserType) {
    return this.create<CreateUserType, User>(payload);
  }

  async getUserById(userId: string) {
    const [user] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    return user;
  }

  async updateUser(userId: string, payload: UpdateUserType) {
    const [updatedUser] = await db
      .update(userTable)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId))
      .returning();
    return updatedUser;
  }
}
