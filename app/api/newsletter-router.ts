import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { newsletters } from "@db/schema";
import { eq, desc, count } from "drizzle-orm";
import { sendNewsletterWelcome, sendBulkNewsletter } from "./lib/email";

export const newsletterRouter = createRouter({
  subscribe: publicQuery
    .input(
      z.object({
        email: z.string().email("Valid email is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        if (!existing[0].isActive) {
          await db
            .update(newsletters)
            .set({ isActive: true })
            .where(eq(newsletters.email, input.email));
          return { message: "Welcome back! Your subscription has been reactivated." };
        }
        return { message: "You're already subscribed to our newsletter!" };
      }

      await db.insert(newsletters).values({
        email: input.email,
        isActive: true,
      });

      // Send welcome email (non-blocking)
      sendNewsletterWelcome(input.email).catch(() => {});

      return { message: "Successfully subscribed to the newsletter!" };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    const items = await db
      .select()
      .from(newsletters)
      .orderBy(desc(newsletters.createdAt));

    const totalResult = await db.select({ value: count() }).from(newsletters);
    const activeResult = await db
      .select({ value: count() })
      .from(newsletters)
      .where(eq(newsletters.isActive, true));

    return {
      items,
      total: totalResult[0]?.value ?? 0,
      active: activeResult[0]?.value ?? 0,
    };
  }),

  unsubscribe: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(newsletters)
        .set({ isActive: false })
        .where(eq(newsletters.email, input.email));
      return { success: true, message: "You have been unsubscribed." };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(newsletters).where(eq(newsletters.id, input.id));
      return { success: true };
    }),

  sendBulk: adminQuery
    .input(
      z.object({
        subject: z.string().min(1, "Subject is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const activeSubscribers = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.isActive, true));

      const emails = activeSubscribers.map((s) => s.email);
      if (emails.length === 0) {
        return { sent: 0, failed: 0, message: "No active subscribers found." };
      }

      const result = await sendBulkNewsletter(emails, input.subject, input.content);
      return {
        ...result,
        message: `Newsletter sent to ${result.sent} subscriber(s)${result.failed > 0 ? `, ${result.failed} failed` : ""}.`,
      };
    }),
});
