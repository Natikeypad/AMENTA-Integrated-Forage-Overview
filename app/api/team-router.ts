import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { team } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const teamRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(team).orderBy(asc(team.order));
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(team)
        .where(eq(team.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        name: z.string().min(1),
        role: z.string().min(1),
        bio: z.string().optional(),
        image: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        department: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(team).values({
        ...input,
        order: input.order ?? 0,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        image: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        department: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(team).set(data).where(eq(team.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(team).where(eq(team.id, input.id));
      return { success: true };
    }),
});
