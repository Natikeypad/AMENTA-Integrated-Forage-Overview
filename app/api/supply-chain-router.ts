import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { supplyChain } from "@db/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";

export const supplyChainRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        productType: z.string().optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 20;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(supplyChain.status, input.status as any));
      }
      if (input?.productType) {
        conditions.push(eq(supplyChain.productType, input.productType as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = whereClause
        ? await db.select().from(supplyChain).where(whereClause).orderBy(desc(supplyChain.createdAt)).limit(limit).offset(offset)
        : await db.select().from(supplyChain).orderBy(desc(supplyChain.createdAt)).limit(limit).offset(offset);

      const totalResult = whereClause
        ? await db.select({ value: count() }).from(supplyChain).where(whereClause)
        : await db.select({ value: count() }).from(supplyChain);

      return {
        items,
        total: totalResult[0]?.value ?? 0,
        page,
        totalPages: Math.ceil((totalResult[0]?.value ?? 0) / limit),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(supplyChain).where(eq(supplyChain.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ value: count() }).from(supplyChain);
    const totalValue = await db.select({ value: sql`COALESCE(SUM(${supplyChain.totalValue}), 0)` }).from(supplyChain);
    
    const byStatus = await db
      .select({
        status: supplyChain.status,
        count: count(),
        totalValue: sql`COALESCE(SUM(${supplyChain.totalValue}), 0)`,
      })
      .from(supplyChain)
      .groupBy(supplyChain.status);

    const byType = await db
      .select({
        productType: supplyChain.productType,
        count: count(),
        totalValue: sql`COALESCE(SUM(${supplyChain.totalValue}), 0)`,
      })
      .from(supplyChain)
      .groupBy(supplyChain.productType);

    return {
      total: totalResult[0]?.value ?? 0,
      totalValue: Number(totalValue[0]?.value ?? 0),
      byStatus,
      byType,
    };
  }),

  create: adminQuery
    .input(
      z.object({
        productName: z.string().min(1),
        productType: z.enum(["forage_seed", "hay_fodder", "live_animal", "meat", "other"]).optional(),
        batchNumber: z.string().optional(),
        sourceField: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        harvestDate: z.string().optional(),
        storageLocation: z.string().optional(),
        storageDate: z.string().optional(),
        transportDate: z.string().optional(),
        deliveryDate: z.string().optional(),
        destination: z.string().optional(),
        status: z.enum(["cultivating", "harvested", "in_storage", "in_transport", "delivered", "sold"]).optional(),
        quality: z.enum(["premium", "standard", "below_standard"]).optional(),
        buyerName: z.string().optional(),
        buyerContact: z.string().optional(),
        pricePerUnit: z.number().optional(),
        totalValue: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(supplyChain).values({
        ...input,
        productType: input.productType ?? "other",
        status: input.status ?? "cultivating",
        quality: input.quality ?? "standard",
        harvestDate: input.harvestDate ? new Date(input.harvestDate) : undefined,
        storageDate: input.storageDate ? new Date(input.storageDate) : undefined,
        transportDate: input.transportDate ? new Date(input.transportDate) : undefined,
        deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : undefined,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        productName: z.string().optional(),
        productType: z.enum(["forage_seed", "hay_fodder", "live_animal", "meat", "other"]).optional(),
        batchNumber: z.string().optional(),
        sourceField: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        harvestDate: z.string().optional(),
        storageLocation: z.string().optional(),
        storageDate: z.string().optional(),
        transportDate: z.string().optional(),
        deliveryDate: z.string().optional(),
        destination: z.string().optional(),
        status: z.enum(["cultivating", "harvested", "in_storage", "in_transport", "delivered", "sold"]).optional(),
        quality: z.enum(["premium", "standard", "below_standard"]).optional(),
        buyerName: z.string().optional(),
        buyerContact: z.string().optional(),
        pricePerUnit: z.number().optional(),
        totalValue: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.harvestDate) updateData.harvestDate = new Date(data.harvestDate);
      if (data.storageDate) updateData.storageDate = new Date(data.storageDate);
      if (data.transportDate) updateData.transportDate = new Date(data.transportDate);
      if (data.deliveryDate) updateData.deliveryDate = new Date(data.deliveryDate);
      await db.update(supplyChain).set(updateData).where(eq(supplyChain.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(supplyChain).where(eq(supplyChain.id, input.id));
      return { success: true };
    }),
});
