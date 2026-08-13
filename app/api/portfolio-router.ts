import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { portfolio } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const portfolioRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(portfolio).orderBy(desc(portfolio.createdAt));
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(portfolio)
        .where(eq(portfolio.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        image: z.string().optional(),
        stat1Value: z.string().optional(),
        stat1Label: z.string().optional(),
        stat2Value: z.string().optional(),
        stat2Label: z.string().optional(),
        stat3Value: z.string().optional(),
        stat3Label: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(portfolio).values({
        ...input,
        status: input.status ?? "active",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        stat1Value: z.string().optional(),
        stat1Label: z.string().optional(),
        stat2Value: z.string().optional(),
        stat2Label: z.string().optional(),
        stat3Value: z.string().optional(),
        stat3Label: z.string().optional(),
        status: z.enum(["active", "completed", "planned"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(portfolio).set(data).where(eq(portfolio.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(portfolio).where(eq(portfolio.id, input.id));
      return { success: true };
    }),
});
