import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contacts } from "@db/schema";
import { eq, desc, count, sql } from "drizzle-orm";
import { sendContactNotification, sendContactAutoReply } from "./lib/email";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        subject: z.string().min(1, "Subject is required"),
        message: z.string().min(1, "Message is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(contacts).values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        status: "new",
      });

      // Send email notifications (non-blocking)
      sendContactNotification(input).catch(() => {});
      sendContactAutoReply(input).catch(() => {});

      return { message: "Message sent successfully! We'll get back to you soon." };
    }),

  list: adminQuery
    .input(z.object({ page: z.number().optional(), limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
    const db = getDb();
    const page = input?.page ?? 1;
    const limit = input?.limit ?? 20;
    const offset = (page - 1) * limit;

    const items = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select({ value: count() }).from(contacts);
    const total = totalResult[0]?.value ?? 0;

    return { items, total, page, totalPages: Math.ceil(total / limit) };
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(contacts)
        .set({ status: input.status })
        .where(eq(contacts.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const totalResult = await db.select({ value: count() }).from(contacts);
    const newResult = await db
      .select({ value: count() })
      .from(contacts)
      .where(eq(contacts.status, "new"));
    const thisWeekResult = await db
      .select({ value: count() })
      .from(contacts)
      .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)`);

    return {
      total: totalResult[0]?.value ?? 0,
      new: newResult[0]?.value ?? 0,
      thisWeek: thisWeekResult[0]?.value ?? 0,
    };
  }),
});
