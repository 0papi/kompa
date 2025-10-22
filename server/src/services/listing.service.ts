import { CreateListingType } from "@/schemas/listing.schema";
import { listings as listingTable, Listing } from "@/models/listing.model";
import { eq, and, desc, isNull, or, sql, gte, lte } from "drizzle-orm";
import { BaseService } from "./base.service";
import { db } from "@/db";

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

  async getPublishedListings(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
    propertyCategory?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;
  }) {
    const { page = 1, limit = 12, ...searchFilters } = filters || {};
    const offset = (page - 1) * limit;

    // Build base conditions
    const baseConditions = and(
      eq(listingTable.status, "PUBLISHED"),
      isNull(listingTable.deletedAt),
    );

    // Build search conditions
    const searchConditions: any[] = [baseConditions];

    if (searchFilters.search) {
      const searchTerm = `%${searchFilters.search.toLowerCase()}%`;
      searchConditions.push(
        or(
          sql`LOWER(${listingTable.title}) LIKE ${searchTerm}`,
          sql`LOWER(${listingTable.description}) LIKE ${searchTerm}`,
          sql`LOWER(${listingTable.city}) LIKE ${searchTerm}`,
          sql`LOWER(${listingTable.state}) LIKE ${searchTerm}`,
        ),
      );
    }

    if (searchFilters.city) {
      searchConditions.push(
        sql`LOWER(${listingTable.city}) LIKE ${`%${searchFilters.city.toLowerCase()}%`}`,
      );
    }

    if (searchFilters.state) {
      searchConditions.push(eq(listingTable.state, searchFilters.state));
    }

    if (searchFilters.propertyCategory) {
      searchConditions.push(
        eq(listingTable.propertyCategory, searchFilters.propertyCategory),
      );
    }

    if (searchFilters.propertyType) {
      searchConditions.push(
        eq(listingTable.propertyType, searchFilters.propertyType),
      );
    }

    if (searchFilters.minPrice !== undefined) {
      searchConditions.push(
        gte(listingTable.price, searchFilters.minPrice.toString()),
      );
    }

    if (searchFilters.maxPrice !== undefined) {
      searchConditions.push(
        lte(listingTable.price, searchFilters.maxPrice.toString()),
      );
    }

    if (searchFilters.minBedrooms !== undefined) {
      searchConditions.push(
        gte(listingTable.bedrooms, searchFilters.minBedrooms),
      );
    }

    if (searchFilters.minBathrooms !== undefined) {
      searchConditions.push(
        gte(listingTable.bathrooms, searchFilters.minBathrooms.toString()),
      );
    }

    if (searchFilters.minSquareFeet !== undefined) {
      searchConditions.push(
        gte(listingTable.squareFeet, searchFilters.minSquareFeet),
      );
    }

    if (searchFilters.maxSquareFeet !== undefined) {
      searchConditions.push(
        lte(listingTable.squareFeet, searchFilters.maxSquareFeet),
      );
    }

    const finalConditions = and(...searchConditions);

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(listingTable)
      .where(finalConditions);

    const total = countResult[0]?.count || 0;

    // Get paginated results
    const results = await db
      .select()
      .from(listingTable)
      .where(finalConditions)
      .orderBy(desc(listingTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      data: results as Listing[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
      },
    };
  }
}
