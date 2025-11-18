import { db } from "@/db";
import { eq, and, desc, isNull, SQL } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

export class BaseService<T extends PgTable> {
  constructor(protected table: T) {}

  /**
   * Create a new record
   */
  async create<TInsert = any, TSelect = any>(
    payload: TInsert,
  ): Promise<TSelect> {
    const [record] = await db
      .insert(this.table)
      .values(payload as any)
      .returning();

    return record as TSelect;
  }

  /**
   * Find a record by ID
   */
  async findById<TSelect = any>(
    id: string,
    additionalConditions?: SQL,
  ): Promise<TSelect | undefined> {
    const conditions = additionalConditions
      ? and(eq(this.table.id, id), additionalConditions)
      : eq(this.table.id, id);

    const [record] = await db
      .select()
      .from(this.table)
      .where(conditions)
      .limit(1);

    return record as TSelect | undefined;
  }

  /**
   * Find a record by custom conditions
   */
  async findOne<TSelect = any>(conditions: SQL): Promise<TSelect | undefined> {
    const [record] = await db
      .select()
      .from(this.table)
      .where(conditions)
      .limit(1);

    return record as TSelect | undefined;
  }


 /**
  * Find one with relation
  */
async findOneWithRelation<TSelect = any>(
  conditions: SQL,
  joinTable?: any,
  joinCondition?: SQL
): Promise<TSelect | undefined> {
  let query = db.select().from(this.table).where(conditions);

  if (joinTable && joinCondition) {
    query = query.leftJoin(joinTable, joinCondition);
  }

  const [record] = await query.limit(1);
  return record as TSelect | undefined;
}

  /**
   * Find all records matching conditions
   */
  async findMany<TSelect = any>(
    conditions?: SQL,
    orderBy?: SQL,
  ): Promise<TSelect[]> {
    try {
      let query = db.select().from(this.table);
      if (conditions) {
        query = query.where(conditions) as any;
      }
      if (orderBy) {
        query = query.orderBy(orderBy) as any;
      }
   
      const records = await query;
    
      return records as TSelect[];
    } catch (error) {
      console.error("Database error:", error);
      throw error;
    }
  }
  /**
   * Update a record by ID
   */
  async update<TUpdate = any, TSelect = any>(
    id: string,
    payload: TUpdate,
    additionalConditions?: SQL,
  ): Promise<TSelect | undefined> {
    const conditions = additionalConditions
      ? and(eq(this.table.id, id), additionalConditions)
      : eq(this.table.id, id);

    const [updatedRecord] = await db
      .update(this.table)
      .set({
        ...payload,
        updatedAt: new Date(),
      } as any)
      .where(conditions)
      .returning();

    return updatedRecord as TSelect | undefined;
  }

  /**
   * Hard delete a record by ID
   */
  async delete<TSelect = any>(
    id: string,
    additionalConditions?: SQL,
  ): Promise<TSelect | undefined> {
    const conditions = additionalConditions
      ? and(eq(this.table.id, id), additionalConditions)
      : eq(this.table.id, id);

    const [deletedRecord] = await db
      .delete(this.table)
      .where(conditions)
      .returning();

    return deletedRecord as TSelect | undefined;
  }

  /**
   * Soft delete a record by setting deletedAt timestamp
   * Only works if the table has a deletedAt column
   */
  async softDelete<TSelect = any>(
    id: string,
    additionalConditions?: SQL,
  ): Promise<TSelect | undefined> {
    const baseConditions = and(
      eq(this.table.id, id),
      isNull((this.table as any).deletedAt),
    );

    const conditions = additionalConditions
      ? and(baseConditions, additionalConditions)
      : baseConditions;

    const [deletedRecord] = await db
      .update(this.table)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(conditions)
      .returning();

    return deletedRecord as TSelect | undefined;
  }

  /**
   * Restore a soft-deleted record
   * Only works if the table has a deletedAt column
   */
  async restore<TSelect = any>(
    id: string,
    additionalConditions?: SQL,
  ): Promise<TSelect | undefined> {
    const conditions = additionalConditions
      ? and(eq(this.table.id, id), additionalConditions)
      : eq(this.table.id, id);

    const [restoredRecord] = await db
      .update(this.table)
      .set({
        deletedAt: null,
        updatedAt: new Date(),
      } as any)
      .where(conditions)
      .returning();

    return restoredRecord as TSelect | undefined;
  }
}
