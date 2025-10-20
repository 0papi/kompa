import { users } from "@/models/user.model";
import { listings } from "@/models/listing.model";

export const tables = {
  users,
  listings,
} as const;

export type TableName = keyof typeof tables;
