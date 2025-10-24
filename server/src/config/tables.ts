import { users } from "@/models/user.model";
import { listings } from "@/models/listing.model";
import { favorite } from "@/models/favorite.model";

export const tables = {
  users,
  listings,
  favorites: favorite,
} as const;

export type TableName = keyof typeof tables;
