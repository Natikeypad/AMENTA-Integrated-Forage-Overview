import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { gallery } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const galleryRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const items = input?.category
        ? await db.select().from(gallery).where(eq(gallery.category, input.category)).orderBy(asc(gallery.order))
        : await db.select().from(gallery).orderBy(asc(gallery.order));
      return items;
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(gallery)
        .where(eq(gallery.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().min(1, "Image URL is required"),
        category: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(gallery).values({
        ...input,
        order: input.order ?? 0,
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
        category: z.string().optional(),
        order: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(gallery).set(data).where(eq(gallery.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(gallery).where(eq(gallery.id, input.id));
      return { success: true };
    }),
});
