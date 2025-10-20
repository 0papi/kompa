import { CreateListingType } from "@/schemas/listing.schema";
import { listings as listingTable, Listing } from "@/models/listing.model";
import { eq, and, desc, isNull } from "drizzle-orm";
import { BaseService } from "./base.service";

export class ListingService extends BaseService<typeof listingTable> {
  constructor() {
    super(listingTable);
  }

  async createListing(userId: string, payload: CreateListingType) {
    return this.create<typeof payload & { userId: string }, Listing>({
      ...payload,
      userId,
    });
  }

  async getListingById(listingId: string, userId?: string) {
    const conditions = userId
      ? and(eq(listingTable.userId, userId), isNull(listingTable.deletedAt))
      : isNull(listingTable.deletedAt);

    return this.findById<Listing>(listingId, conditions);
  }

  async getUserListings(userId: string) {
    console.log("fetching for user", userId);
    return this.findMany<Listing>(
      and(eq(listingTable.userId, userId), isNull(listingTable.deletedAt)),
      desc(listingTable.createdAt),
    );
  }

  async updateListing(
    listingId: string,
    userId: string,
    payload: Partial<CreateListingType>,
  ) {
    return this.update<Partial<CreateListingType>, Listing>(
      listingId,
      payload,
      and(eq(listingTable.userId, userId), isNull(listingTable.deletedAt)),
    );
  }

  async deleteListing(listingId: string, userId: string) {
    return this.softDelete<Listing>(listingId, eq(listingTable.userId, userId));
  }

  async restoreListing(listingId: string, userId: string) {
    return this.restore<Listing>(listingId, eq(listingTable.userId, userId));
  }

  async getPublishedListings() {
    return this.findMany<Listing>(
      and(eq(listingTable.status, "PUBLISHED"), isNull(listingTable.deletedAt)),
      desc(listingTable.createdAt),
    );
  }
}
