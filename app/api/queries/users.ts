import { eq } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByGoogleId(googleId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.googleId, googleId))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  if (
    values.role === undefined &&
    values.googleId &&
    values.googleId === env.ownerUnionId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  const [result] = await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
    
  return result;
}

export async function createUser(data: InsertUser) {
  const [result] = await getDb().insert(schema.users).values(data);
  return result.insertId;
}
