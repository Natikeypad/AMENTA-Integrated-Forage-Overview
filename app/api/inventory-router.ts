import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { inventory } from "@db/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";

export const inventoryRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        lowStock: z.boolean().optional(),
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
      if (input?.category) {
        conditions.push(eq(inventory.category, input.category as any));
      }
      if (input?.lowStock) {
        conditions.push(sql`${inventory.quantity} <= ${inventory.minStockLevel}`);
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = whereClause
        ? await db.select().from(inventory).where(whereClause).orderBy(desc(inventory.createdAt)).limit(limit).offset(offset)
        : await db.select().from(inventory).orderBy(desc(inventory.createdAt)).limit(limit).offset(offset);

      const totalResult = whereClause
        ? await db.select({ value: count() }).from(inventory).where(whereClause)
        : await db.select({ value: count() }).from(inventory);

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
      const result = await db.select().from(inventory).where(eq(inventory.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ value: count() }).from(inventory);
    const totalValue = await db.select({ value: sql`COALESCE(SUM(${inventory.quantity} * ${inventory.costPerUnit}), 0)` }).from(inventory);
    const lowStockResult = await db
      .select({ value: count() })
      .from(inventory)
      .where(sql`${inventory.quantity} <= ${inventory.minStockLevel}`);

    const byCategory = await db
      .select({
        category: inventory.category,
        count: count(),
        totalValue: sql`COALESCE(SUM(${inventory.quantity} * ${inventory.costPerUnit}), 0)`,
      })
      .from(inventory)
      .groupBy(inventory.category);

    return {
      total: totalResult[0]?.value ?? 0,
      totalValue: Number(totalValue[0]?.value ?? 0),
      lowStock: lowStockResult[0]?.value ?? 0,
      byCategory,
    };
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        category: z.enum(["seed", "fertilizer", "pesticide", "feed", "equipment", "fuel", "other"]).optional(),
        sku: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        minStockLevel: z.number().optional(),
        reorderPoint: z.number().optional(),
        costPerUnit: z.number().optional(),
        supplier: z.string().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(inventory).values({
        ...input,
        category: input.category ?? "other",
        quantity: input.quantity ?? 0,
        unit: input.unit ?? "units",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        category: z.enum(["seed", "fertilizer", "pesticide", "feed", "equipment", "fuel", "other"]).optional(),
        sku: z.string().optional(),
        quantity: z.number().optional(),
        unit: z.string().optional(),
        minStockLevel: z.number().optional(),
        reorderPoint: z.number().optional(),
        costPerUnit: z.number().optional(),
        supplier: z.string().optional(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(inventory).set(data).where(eq(inventory.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(inventory).where(eq(inventory.id, input.id));
      return { success: true };
    }),
});
