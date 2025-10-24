import { CreateUserType } from "@/schemas/user.schema";
import { users as userTable, User } from "@/models/user.model";
import { BaseService } from "./base.service";

export class UserService extends BaseService<typeof userTable> {
  constructor() {
    super(userTable);
  }

  async createUser(payload: CreateUserType) {
    return this.create<CreateUserType, User>(payload);
  }
}
