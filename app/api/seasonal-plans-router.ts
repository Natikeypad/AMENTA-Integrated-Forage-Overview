import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { seasonalPlans } from "@db/schema";
import { eq, desc, count, and } from "drizzle-orm";

export const seasonalPlansRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        year: z.number().optional(),
        status: z.string().optional(),
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
      if (input?.year) {
        conditions.push(eq(seasonalPlans.year, input.year));
      }
      if (input?.status) {
        conditions.push(eq(seasonalPlans.status, input.status as any));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = whereClause
        ? await db.select().from(seasonalPlans).where(whereClause).orderBy(desc(seasonalPlans.createdAt)).limit(limit).offset(offset)
        : await db.select().from(seasonalPlans).orderBy(desc(seasonalPlans.createdAt)).limit(limit).offset(offset);

      const totalResult = whereClause
        ? await db.select({ value: count() }).from(seasonalPlans).where(whereClause)
        : await db.select({ value: count() }).from(seasonalPlans);

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
      const result = await db.select().from(seasonalPlans).where(eq(seasonalPlans.id, input.id)).limit(1);
      return result[0] ?? null;
    }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ value: count() }).from(seasonalPlans);
    const inProgressResult = await db.select({ value: count() }).from(seasonalPlans).where(eq(seasonalPlans.status, "in_progress"));
    const approvedResult = await db.select({ value: count() }).from(seasonalPlans).where(eq(seasonalPlans.status, "approved"));

    return {
      total: totalResult[0]?.value ?? 0,
      inProgress: inProgressResult[0]?.value ?? 0,
      approved: approvedResult[0]?.value ?? 0,
    };
  }),

  create: adminQuery
    .input(
      z.object({
        season: z.string().min(1),
        year: z.number(),
        cropName: z.string().min(1),
        plannedArea: z.number().optional(),
        expectedYieldPerHectare: z.number().optional(),
        plantingStartDate: z.string().optional(),
        plantingEndDate: z.string().optional(),
        harvestStartDate: z.string().optional(),
        harvestEndDate: z.string().optional(),
        waterRequirement: z.number().optional(),
        fertilizerPlan: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "approved", "in_progress", "completed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(seasonalPlans).values({
        ...input,
        status: input.status ?? "draft",
        plantingStartDate: input.plantingStartDate ? new Date(input.plantingStartDate) : undefined,
        plantingEndDate: input.plantingEndDate ? new Date(input.plantingEndDate) : undefined,
        harvestStartDate: input.harvestStartDate ? new Date(input.harvestStartDate) : undefined,
        harvestEndDate: input.harvestEndDate ? new Date(input.harvestEndDate) : undefined,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        season: z.string().optional(),
        year: z.number().optional(),
        cropName: z.string().optional(),
        plannedArea: z.number().optional(),
        expectedYieldPerHectare: z.number().optional(),
        plantingStartDate: z.string().optional(),
        plantingEndDate: z.string().optional(),
        harvestStartDate: z.string().optional(),
        harvestEndDate: z.string().optional(),
        waterRequirement: z.number().optional(),
        fertilizerPlan: z.string().optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "approved", "in_progress", "completed", "cancelled"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.plantingStartDate) updateData.plantingStartDate = new Date(data.plantingStartDate);
      if (data.plantingEndDate) updateData.plantingEndDate = new Date(data.plantingEndDate);
      if (data.harvestStartDate) updateData.harvestStartDate = new Date(data.harvestStartDate);
      if (data.harvestEndDate) updateData.harvestEndDate = new Date(data.harvestEndDate);
      await db.update(seasonalPlans).set(updateData).where(eq(seasonalPlans.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(seasonalPlans).where(eq(seasonalPlans.id, input.id));
      return { success: true };
    }),
});
