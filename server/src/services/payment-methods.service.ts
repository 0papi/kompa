import { BaseService } from "./base.service";
import { paymentMethods, NewPaymentMethod, PaymentMethod } from "@/models/payment-methods.model";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { CreatePaymentMethodType, UpdatePaymentMethodType } from "@/schemas/payment-methods.schema";

export class PaymentMethodsService extends BaseService<typeof paymentMethods> {
  constructor() {
    super(paymentMethods);
  }

  /**
   * Get all payment methods for a user
   */
  async getAllByUserId(userId: string): Promise<PaymentMethod[]> {
    return db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(paymentMethods.createdAt);
  }

  /**
   * Get a specific payment method for a user
   */
  async getByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<PaymentMethod | undefined> {
    return this.findOne(
      and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)),
    );
  }

  /**
   * Create a new payment method
   */
  async createForUser(
    userId: string,
    data: CreatePaymentMethodType,
  ): Promise<PaymentMethod> {
    // If this is set as preferred, unset all other preferred methods
    if (data.isPreferred) {
      await this.unsetPreferredForUser(userId);
    }

    return this.create<NewPaymentMethod, PaymentMethod>({
      userId,
      ...data,
    });
  }

  /**
   * Update a payment method
   */
  async updateForUser(
    id: string,
    userId: string,
    data: UpdatePaymentMethodType,
  ): Promise<PaymentMethod | undefined> {
    // If setting as preferred, unset all other preferred methods
    if (data.isPreferred) {
      await this.unsetPreferredForUser(userId, id);
    }

    const [updated] = await db
      .update(paymentMethods)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .returning();

    return updated;
  }

  /**
   * Delete a payment method
   */
  async deleteForUser(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(paymentMethods)
      .where(and(eq(paymentMethods.id, id), eq(paymentMethods.userId, userId)))
      .returning();

    return result.length > 0;
  }

  /**
   * Get the preferred payment method for a user
   */
  async getPreferredByUserId(userId: string): Promise<PaymentMethod | undefined> {
    const [method] = await db
      .select()
      .from(paymentMethods)
      .where(
        and(
          eq(paymentMethods.userId, userId),
          eq(paymentMethods.isPreferred, true),
        ),
      )
      .limit(1);

    return method;
  }

  /**
   * Unset preferred status for all payment methods of a user (except one)
   */
  private async unsetPreferredForUser(
    userId: string,
    exceptId?: string,
  ): Promise<void> {
    const conditions = exceptId
      ? and(
          eq(paymentMethods.userId, userId),
          eq(paymentMethods.isPreferred, true),
        )
      : and(
          eq(paymentMethods.userId, userId),
          eq(paymentMethods.isPreferred, true),
        );

    await db
      .update(paymentMethods)
      .set({ isPreferred: false, updatedAt: new Date() })
      .where(conditions);
  }
}
