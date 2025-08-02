import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("user"), // admin, manager, distributor, viewer
  region: text("region"),
  currency: text("currency").default("ZAR"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // EPS, BR, LED
  subcategory: text("subcategory"), // Premium, Budget, Ready
  dimensions: text("dimensions"),
  packSize: integer("pack_size"),
  packsPerBox: integer("packs_per_box"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
  weight: decimal("weight", { precision: 8, scale: 3 }),
  specifications: jsonb("specifications"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  location: text("location").notNull().default("main_warehouse"),
  currentStock: integer("current_stock").notNull().default(0),
  reservedStock: integer("reserved_stock").notNull().default(0),
  reorderPoint: integer("reorder_point").notNull().default(100),
  maxStock: integer("max_stock").notNull().default(10000),
  lastRestocked: timestamp("last_restocked"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const distributors = pgTable("distributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city").notNull(),
  region: text("region").notNull(),
  country: text("country").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, pending
  tier: text("tier").notNull().default("standard"), // premium, standard, basic
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0.00"),
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).default("0.00"),
  paymentTerms: text("payment_terms").default("COD"),
  brands: jsonb("brands"), // Array of sub-brands they can sell
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  distributorId: varchar("distributor_id").notNull().references(() => distributors.id),
  status: text("status").notNull().default("pending"), // pending, confirmed, production, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).default("1.000000"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  expectedDelivery: timestamp("expected_delivery"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
});

export const productionSchedule = pgTable("production_schedule", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  plannedQuantity: integer("planned_quantity").notNull(),
  actualQuantity: integer("actual_quantity").default(0),
  productionLine: text("production_line").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  priority: text("priority").notNull().default("normal"), // high, normal, low
  efficiency: decimal("efficiency", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const demandForecast = pgTable("demand_forecast", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  region: text("region").notNull(),
  forecastDate: timestamp("forecast_date").notNull(),
  predictedDemand: integer("predicted_demand").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  seasonalFactor: decimal("seasonal_factor", { precision: 5, scale: 2 }),
  marketTrend: text("market_trend"), // up, down, stable
  modelVersion: text("model_version").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const salesMetrics = pgTable("sales_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  region: text("region").notNull(),
  productId: varchar("product_id").references(() => products.id),
  distributorId: varchar("distributor_id").references(() => distributors.id),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).notNull(),
  units: integer("units").notNull(),
  currency: text("currency").notNull(),
  metricType: text("metric_type").notNull(), // daily, weekly, monthly
});

export const brands = pgTable("brands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  color: text("color").notNull(),
  icon: text("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  inventory: one(inventory, { fields: [products.id], references: [inventory.productId] }),
  orderItems: many(orderItems),
  productionSchedule: many(productionSchedule),
  demandForecast: many(demandForecast),
  salesMetrics: many(salesMetrics),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, { fields: [inventory.productId], references: [products.id] }),
}));

export const distributorsRelations = relations(distributors, ({ many }) => ({
  orders: many(orders),
  salesMetrics: many(salesMetrics),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  distributor: one(distributors, { fields: [orders.distributorId], references: [distributors.id] }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const productionScheduleRelations = relations(productionSchedule, ({ one }) => ({
  product: one(products, { fields: [productionSchedule.productId], references: [products.id] }),
}));

export const demandForecastRelations = relations(demandForecast, ({ one }) => ({
  product: one(products, { fields: [demandForecast.productId], references: [products.id] }),
}));

export const salesMetricsRelations = relations(salesMetrics, ({ one }) => ({
  product: one(products, { fields: [salesMetrics.productId], references: [products.id] }),
  distributor: one(distributors, { fields: [salesMetrics.distributorId], references: [distributors.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, updatedAt: true });
export const insertDistributorSchema = createInsertSchema(distributors).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertProductionScheduleSchema = createInsertSchema(productionSchedule).omit({ id: true, createdAt: true });
export const insertDemandForecastSchema = createInsertSchema(demandForecast).omit({ id: true, createdAt: true });
export const insertSalesMetricsSchema = createInsertSchema(salesMetrics).omit({ id: true });
export const insertBrandSchema = createInsertSchema(brands).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Distributor = typeof distributors.$inferSelect;
export type InsertDistributor = z.infer<typeof insertDistributorSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type ProductionSchedule = typeof productionSchedule.$inferSelect;
export type InsertProductionSchedule = z.infer<typeof insertProductionScheduleSchema>;
export type DemandForecast = typeof demandForecast.$inferSelect;
export type InsertDemandForecast = z.infer<typeof insertDemandForecastSchema>;
export type SalesMetrics = typeof salesMetrics.$inferSelect;
export type InsertSalesMetrics = z.infer<typeof insertSalesMetricsSchema>;
export type Brand = typeof brands.$inferSelect;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
