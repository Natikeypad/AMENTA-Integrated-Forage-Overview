import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { weatherData } from "@db/schema";
import { eq, desc, sql, and, asc } from "drizzle-orm";

export const weatherRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        forecast: z.boolean().optional(),
        limit: z.number().optional().default(14),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 14;

      const conditions = [];
      if (input?.forecast !== undefined) {
        conditions.push(eq(weatherData.forecast, input.forecast));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const items = whereClause
        ? await db.select().from(weatherData).where(whereClause).orderBy(desc(weatherData.date)).limit(limit)
        : await db.select().from(weatherData).orderBy(desc(weatherData.date)).limit(limit);

      return items;
    }),

  latest: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select()
      .from(weatherData)
      .where(eq(weatherData.forecast, false))
      .orderBy(desc(weatherData.date))
      .limit(1);
    return result[0] ?? null;
  }),

  forecast: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(weatherData)
      .where(eq(weatherData.forecast, true))
      .orderBy(asc(weatherData.date))
      .limit(7);
  }),

  stats: publicQuery.query(async () => {
    const db = getDb();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const avgTemp = await db
      .select({ value: sql`COALESCE(AVG(${weatherData.temperature}), 0)` })
      .from(weatherData)
      .where(sql`${weatherData.forecast} = false AND ${weatherData.date} >= ${thirtyDaysAgo.toISOString().split("T")[0]}`);

    const totalRainfall = await db
      .select({ value: sql`COALESCE(SUM(${weatherData.rainfall}), 0)` })
      .from(weatherData)
      .where(sql`${weatherData.forecast} = false AND ${weatherData.date} >= ${thirtyDaysAgo.toISOString().split("T")[0]}`);

    const avgHumidity = await db
      .select({ value: sql`COALESCE(AVG(${weatherData.humidity}), 0)` })
      .from(weatherData)
      .where(sql`${weatherData.forecast} = false AND ${weatherData.date} >= ${thirtyDaysAgo.toISOString().split("T")[0]}`);

    return {
      avgTemp: Number(avgTemp[0]?.value ?? 0).toFixed(1),
      totalRainfall: Number(totalRainfall[0]?.value ?? 0).toFixed(1),
      avgHumidity: Number(avgHumidity[0]?.value ?? 0).toFixed(1),
    };
  }),

  create: adminQuery
    .input(
      z.object({
        date: z.string(),
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        rainfall: z.number().optional(),
        windSpeed: z.number().optional(),
        windDirection: z.string().optional(),
        condition: z.string().optional(),
        uvIndex: z.number().optional(),
        soilMoisture: z.number().optional(),
        forecast: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(weatherData).values({
        ...input,
        date: new Date(input.date),
        forecast: input.forecast ?? false,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        date: z.string().optional(),
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        rainfall: z.number().optional(),
        windSpeed: z.number().optional(),
        windDirection: z.string().optional(),
        condition: z.string().optional(),
        uvIndex: z.number().optional(),
        soilMoisture: z.number().optional(),
        forecast: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: any = { ...data };
      if (data.date) updateData.date = new Date(data.date);
      await db.update(weatherData).set(updateData).where(eq(weatherData.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(weatherData).where(eq(weatherData.id, input.id));
      return { success: true };
    }),
});
