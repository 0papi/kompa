import { db } from "@/db";
import { CreateUserType } from "@/schemas/user.schema";
import { users as userTable } from "@/models/user.model";

export class UserService {
  async createUser(payload: CreateUserType) {
    return db.insert(userTable).values(payload);
  }
}
