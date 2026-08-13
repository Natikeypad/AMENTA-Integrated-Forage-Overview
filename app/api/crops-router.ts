import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { crops } from "@db/schema";
import { eq, desc, count, sql, and } from "drizzle-orm";

export const cropsRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        status: z.string().optional(),
        type: z.string().optional(),
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
        conditions.push(eq(crops.status, input.status as any));
      }
      if (input?.type) {
        conditions.push(eq(crops.type, input.type as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = whereClause
        ? await db.select().from(crops).where(whereClause).orderBy(desc(crops.createdAt)).limit(limit).offset(offset)
        : await db.select().from(crops).orderBy(desc(crops.createdAt)).limit(limit).offset(offset);

      const totalResult = whereClause
        ? await db.select({ value: count() }).from(crops).where(whereClause)
        : await db.select({ value: count() }).from(crops);

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
      const result = await db.select().from(crops).where(eq(crops.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ value: count() }).from(crops);
    const growingResult = await db.select({ value: count() }).from(crops).where(eq(crops.status, "growing"));
    const harvestedResult = await db.select({ value: count() }).from(crops).where(eq(crops.status, "harvested"));
    const totalArea = await db.select({ value: sql`COALESCE(SUM(${crops.areaHectares}), 0)` }).from(crops);
    const totalYield = await db.select({ value: sql`COALESCE(SUM(${crops.actualYield}), 0)` }).from(crops);

    return {
      total: totalResult[0]?.value ?? 0,
      growing: growingResult[0]?.value ?? 0,
      harvested: harvestedResult[0]?.value ?? 0,
      totalArea: Number(totalArea[0]?.value ?? 0),
      totalYield: Number(totalYield[0]?.value ?? 0),
    };
  }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        variety: z.string().optional(),
        type: z.enum(["forage_seed", "hay_fodder", "grain", "vegetable", "other"]).optional(),
        fieldLocation: z.string().optional(),
        areaHectares: z.number().optional(),
        plantingDate: z.string().optional(),
        harvestDate: z.string().optional(),
        expectedYield: z.number().optional(),
        actualYield: z.number().optional(),
        yieldUnit: z.string().optional(),
        status: z.enum(["planned", "planted", "growing", "harvesting", "harvested", "failed"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(crops).values({
        ...input,
        type: input.type ?? "forage_seed",
        status: input.status ?? "planned",
        plantingDate: input.plantingDate ? new Date(input.plantingDate) : undefined,
        harvestDate: input.harvestDate ? new Date(input.harvestDate) : undefined,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        variety: z.string().optional(),
        type: z.enum(["forage_seed", "hay_fodder", "grain", "vegetable", "other"]).optional(),
        fieldLocation: z.string().optional(),
        areaHectares: z.number().optional(),
        plantingDate: z.string().optional(),
        harvestDate: z.string().optional(),
        expectedYield: z.number().optional(),
        actualYield: z.number().optional(),
        yieldUnit: z.string().optional(),
        status: z.enum(["planned", "planted", "growing", "harvesting", "harvested", "failed"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.plantingDate) updateData.plantingDate = new Date(data.plantingDate);
      if (data.harvestDate) updateData.harvestDate = new Date(data.harvestDate);
      await db.update(crops).set(updateData).where(eq(crops.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(crops).where(eq(crops.id, input.id));
      return { success: true };
    }),
});
