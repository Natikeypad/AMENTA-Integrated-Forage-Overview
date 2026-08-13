import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { news } from "@db/schema";
import { eq, desc, count, and } from "drizzle-orm";

export const newsRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().min(1).max(100).optional().default(12),
        page: z.number().min(1).optional().default(1),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.category) {
        conditions.push(eq(news.category, input.category));
      }
      conditions.push(eq(news.published, true));

      const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

      const items = whereClause
        ? await db
            .select()
            .from(news)
            .where(whereClause)
            .orderBy(desc(news.createdAt))
            .limit(limit)
            .offset(offset)
        : await db
            .select()
            .from(news)
            .where(eq(news.published, true))
            .orderBy(desc(news.createdAt))
            .limit(limit)
            .offset(offset);

      const totalResult = whereClause
        ? await db.select({ value: count() }).from(news).where(whereClause)
        : await db.select({ value: count() }).from(news).where(eq(news.published, true));

      const categories = await db
        .selectDistinct({ category: news.category })
        .from(news)
        .where(eq(news.published, true));

      return {
        items,
        total: totalResult[0]?.value ?? 0,
        page,
        totalPages: Math.ceil((totalResult[0]?.value ?? 0) / limit),
        categories: categories.map((c) => c.category).filter(Boolean),
      };
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(news)
      .where(and(eq(news.featured, true), eq(news.published, true)))
      .orderBy(desc(news.createdAt))
      .limit(4);
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(news)
        .where(eq(news.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(news)
        .where(eq(news.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  // Admin mutations
  create: adminQuery
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        tag: z.string().optional(),
        author: z.string().optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(news).values({
        ...input,
        featured: input.featured ?? false,
        published: input.published ?? true,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        image: z.string().optional(),
        category: z.string().optional(),
        tag: z.string().optional(),
        author: z.string().optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(news).set(data).where(eq(news.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(news).where(eq(news.id, input.id));
      return { success: true };
    }),
});
