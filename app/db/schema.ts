import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  timestamp,
  int,
  boolean,
  float,
  date,
} from "drizzle-orm/mysql-core";

// ─── Users (Auth) ───────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  googleId: varchar("googleId", { length: 255 }).unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Contact Messages ───────────────────────────────────────────
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ─── Newsletter Subscriptions ───────────────────────────────────
export const newsletters = mysqlTable("newsletters", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

// ─── News / Blog Posts ──────────────────────────────────────────
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: text("image"),
  category: varchar("category", { length: 100 }),
  tag: varchar("tag", { length: 100 }),
  author: varchar("author", { length: 255 }),
  featured: boolean("featured").default(false).notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// ─── Gallery Images ─────────────────────────────────────────────
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  image: text("image").notNull(),
  category: varchar("category", { length: 100 }),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Gallery = typeof gallery.$inferSelect;
export type InsertGallery = typeof gallery.$inferInsert;

// ─── Team Members ───────────────────────────────────────────────
export const team = mysqlTable("team", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio"),
  image: text("image"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  department: varchar("department", { length: 100 }),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Team = typeof team.$inferSelect;
export type InsertTeam = typeof team.$inferInsert;

// ─── Portfolio / Projects ───────────────────────────────────────
export const portfolio = mysqlTable("portfolio", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  image: text("image"),
  stat1Value: varchar("stat1Value", { length: 50 }),
  stat1Label: varchar("stat1Label", { length: 100 }),
  stat2Value: varchar("stat2Value", { length: 50 }),
  stat2Label: varchar("stat2Label", { length: 100 }),
  stat3Value: varchar("stat3Value", { length: 50 }),
  stat3Label: varchar("stat3Label", { length: 100 }),
  status: mysqlEnum("status", ["active", "completed", "planned"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Portfolio = typeof portfolio.$inferSelect;
export type InsertPortfolio = typeof portfolio.$inferInsert;

// ─── Crops / Crop Management ────────────────────────────────────
export const crops = mysqlTable("crops", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  variety: varchar("variety", { length: 255 }),
  type: mysqlEnum("type", ["forage_seed", "hay_fodder", "grain", "vegetable", "other"]).default("forage_seed").notNull(),
  fieldLocation: varchar("fieldLocation", { length: 255 }),
  areaHectares: float("areaHectares"),
  plantingDate: date("plantingDate"),
  harvestDate: date("harvestDate"),
  expectedYield: float("expectedYield"),
  actualYield: float("actualYield"),
  yieldUnit: varchar("yieldUnit", { length: 50 }).default("kg"),
  status: mysqlEnum("status", ["planned", "planted", "growing", "harvesting", "harvested", "failed"]).default("planned").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Crop = typeof crops.$inferSelect;
export type InsertCrop = typeof crops.$inferInsert;

// ─── Inventory Items ────────────────────────────────────────────
export const inventory = mysqlTable("inventory", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["seed", "fertilizer", "pesticide", "feed", "equipment", "fuel", "other"]).default("other").notNull(),
  sku: varchar("sku", { length: 100 }),
  quantity: float("quantity").default(0).notNull(),
  unit: varchar("unit", { length: 50 }).default("units").notNull(),
  minStockLevel: float("minStockLevel").default(0),
  reorderPoint: float("reorderPoint").default(0),
  costPerUnit: float("costPerUnit"),
  supplier: varchar("supplier", { length: 255 }),
  location: varchar("location", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// ─── Supply Chain / Product Tracking ────────────────────────────
export const supplyChain = mysqlTable("supply_chain", {
  id: int("id").autoincrement().primaryKey(),
  productName: varchar("productName", { length: 255 }).notNull(),
  productType: mysqlEnum("productType", ["forage_seed", "hay_fodder", "live_animal", "meat", "other"]).default("other").notNull(),
  batchNumber: varchar("batchNumber", { length: 100 }),
  sourceField: varchar("sourceField", { length: 255 }),
  quantity: float("quantity"),
  unit: varchar("unit", { length: 50 }),
  harvestDate: date("harvestDate"),
  storageLocation: varchar("storageLocation", { length: 255 }),
  storageDate: date("storageDate"),
  transportDate: date("transportDate"),
  deliveryDate: date("deliveryDate"),
  destination: varchar("destination", { length: 255 }),
  status: mysqlEnum("status", ["cultivating", "harvested", "in_storage", "in_transport", "delivered", "sold"]).default("cultivating").notNull(),
  quality: mysqlEnum("quality", ["premium", "standard", "below_standard"]).default("standard").notNull(),
  buyerName: varchar("buyerName", { length: 255 }),
  buyerContact: varchar("buyerContact", { length: 255 }),
  pricePerUnit: float("pricePerUnit"),
  totalValue: float("totalValue"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SupplyChain = typeof supplyChain.$inferSelect;
export type InsertSupplyChain = typeof supplyChain.$inferInsert;

// ─── Weather Data ───────────────────────────────────────────────
export const weatherData = mysqlTable("weather_data", {
  id: int("id").autoincrement().primaryKey(),
  date: date("date").notNull(),
  temperature: float("temperature"),
  humidity: float("humidity"),
  rainfall: float("rainfall"),
  windSpeed: float("windSpeed"),
  windDirection: varchar("windDirection", { length: 50 }),
  condition: varchar("condition", { length: 100 }),
  uvIndex: float("uvIndex"),
  soilMoisture: float("soilMoisture"),
  forecast: boolean("forecast").default(false).notNull(),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
});

export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = typeof weatherData.$inferInsert;

// ─── Seasonal Plans ─────────────────────────────────────────────
export const seasonalPlans = mysqlTable("seasonal_plans", {
  id: int("id").autoincrement().primaryKey(),
  season: varchar("season", { length: 50 }).notNull(),
  year: int("year").notNull(),
  cropName: varchar("cropName", { length: 255 }).notNull(),
  plannedArea: float("plannedArea"),
  expectedYieldPerHectare: float("expectedYieldPerHectare"),
  plantingStartDate: date("plantingStartDate"),
  plantingEndDate: date("plantingEndDate"),
  harvestStartDate: date("harvestStartDate"),
  harvestEndDate: date("harvestEndDate"),
  waterRequirement: float("waterRequirement"),
  fertilizerPlan: text("fertilizerPlan"),
  notes: text("notes"),
  status: mysqlEnum("status", ["draft", "approved", "in_progress", "completed", "cancelled"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SeasonalPlan = typeof seasonalPlans.$inferSelect;
export type InsertSeasonalPlan = typeof seasonalPlans.$inferInsert;
