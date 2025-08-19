import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Updated users table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: text("role").notNull().default("viewer"), // admin, manager, staff, viewer
  department: text("department"),
  phone: text("phone"),
  region: text("region"),
  currency: text("currency").default("ZAR"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// Sales Representatives
export const salesReps = pgTable("sales_reps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  empId: text("emp_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  territory: text("territory").notNull(),
  region: text("region").notNull(),
  province: text("province").notNull(),
  targetSales: decimal("target_sales", { precision: 12, scale: 2 }).default("0.00"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hardware Stores (8500+ stores)
export const hardwareStores = pgTable("hardware_stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeCode: text("store_code").notNull().unique(),
  storeName: text("store_name").notNull(),
  ownerName: text("owner_name"),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postalCode: text("postal_code"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  storeSize: text("store_size").default("medium"), // small, medium, large, mega
  storeType: text("store_type").notNull(), // independent, chain, franchise
  creditRating: text("credit_rating").default("B"), // A+, A, B+, B, C+, C, D
  monthlyPotential: decimal("monthly_potential", { precision: 10, scale: 2 }).default("0.00"),
  lastOrderDate: timestamp("last_order_date"),
  lastVisitDate: timestamp("last_visit_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Route Plans (from Excel sheets)
export const routePlans = pgTable("route_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeCode: text("route_code").notNull().unique(),
  routeName: text("route_name").notNull(),
  salesRepId: varchar("sales_rep_id").notNull().references(() => salesReps.id),
  province: text("province").notNull(),
  region: text("region").notNull(),
  visitFrequency: text("visit_frequency").notNull(), // weekly, biweekly, monthly
  totalStores: integer("total_stores").notNull().default(0),
  estimatedDuration: integer("estimated_duration"), // in hours
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Route Store Assignments
export const routeStores = pgTable("route_stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routePlanId: varchar("route_plan_id").notNull().references(() => routePlans.id),
  hardwareStoreId: varchar("hardware_store_id").notNull().references(() => hardwareStores.id),
  visitOrder: integer("visit_order"), // sequence in route
  preferredVisitDay: text("preferred_visit_day"), // monday, tuesday, etc
  estimatedDuration: integer("estimated_duration"), // minutes per visit
  lastVisitDate: timestamp("last_visit_date"),
  nextScheduledVisit: timestamp("next_scheduled_visit"),
  visitNotes: text("visit_notes"),
});

// AI Suggestions for Smart Ordering
export const aiOrderSuggestions = pgTable("ai_order_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hardwareStoreId: varchar("hardware_store_id").notNull().references(() => hardwareStores.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  suggestedQuantity: integer("suggested_quantity").notNull(),
  suggestedValue: decimal("suggested_value", { precision: 10, scale: 2 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  reasoning: text("reasoning"), // AI explanation for the suggestion
  seasonalFactor: decimal("seasonal_factor", { precision: 5, scale: 2 }),
  urgencyLevel: text("urgency_level").default("normal"), // urgent, high, normal, low
  validUntil: timestamp("valid_until").notNull(),
  status: text("status").default("pending"), // pending, accepted, rejected, expired
  createdAt: timestamp("created_at").defaultNow(),
});

// Store Visit Reports
export const storeVisits = pgTable("store_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hardwareStoreId: varchar("hardware_store_id").notNull().references(() => hardwareStores.id),
  salesRepId: varchar("sales_rep_id").notNull().references(() => salesReps.id),
  visitDate: timestamp("visit_date").notNull(),
  visitType: text("visit_type").notNull(), // scheduled, unscheduled, follow_up
  visitDuration: integer("visit_duration"), // minutes
  ordersPlaced: integer("orders_placed").default(0),
  orderValue: decimal("order_value", { precision: 10, scale: 2 }).default("0.00"),
  storeCondition: text("store_condition"), // excellent, good, fair, poor
  stockLevel: text("stock_level"), // overstocked, well_stocked, low_stock, out_of_stock
  competitorActivity: text("competitor_activity"),
  notes: text("notes"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Factory Setup and Ownership Management
export const factorySetups = pgTable("factory_setups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  factoryName: varchar("factory_name").notNull(),
  location: varchar("location").notNull(),
  ownershipPhase: varchar("ownership_phase").notNull().default("planning"), // 'planning', 'setup', 'installation', 'testing', 'operational', 'owned'
  progressPercentage: integer("progress_percentage").default(0),
  totalInvestment: varchar("total_investment").notNull(),
  currentPayment: integer("current_payment").default(0),
  totalPayments: integer("total_payments").default(3),
  monthlyRevenue: varchar("monthly_revenue").default("0"),
  productionCapacity: integer("production_capacity").default(0), // units per month
  aiOptimizationLevel: integer("ai_optimization_level").default(0), // percentage
  connectedStores: integer("connected_stores").default(0),
  targetStores: integer("target_stores").default(300),
  setupDate: timestamp("setup_date").defaultNow(),
  completionDate: timestamp("completion_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const aiInsights = pgTable("ai_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  factoryId: varchar("factory_id").references(() => factorySetups.id),
  type: varchar("type").notNull(), // 'optimization', 'market', 'expansion', 'cost_reduction'
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  impact: varchar("impact").notNull(), // 'high', 'medium', 'low'
  estimatedValue: varchar("estimated_value").notNull(),
  actionRequired: boolean("action_required").default(false),
  status: varchar("status").default("pending"), // 'pending', 'in_progress', 'completed', 'dismissed'
  confidence: integer("confidence").default(85), // AI confidence percentage
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow()
});

export const productionMetrics = pgTable("production_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  factoryId: varchar("factory_id").notNull().references(() => factorySetups.id),
  metricDate: timestamp("metric_date").notNull(),
  dailyOutput: integer("daily_output").default(0),
  efficiency: varchar("efficiency").default("0"), // percentage as string for precision
  qualityScore: varchar("quality_score").default("0"), // percentage as string
  wasteReduction: varchar("waste_reduction").default("0"), // percentage as string
  energySavings: varchar("energy_savings").default("0"), // percentage as string
  profitMargin: varchar("profit_margin").default("0"), // percentage as string
  maintenanceHours: integer("maintenance_hours").default(0),
  downtime: integer("downtime").default(0), // minutes
  createdAt: timestamp("created_at").defaultNow()
});

export const factoryRecommendations = pgTable("factory_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  factoryId: varchar("factory_id").notNull().references(() => factorySetups.id),
  recommendation: text("recommendation").notNull(),
  category: varchar("category").notNull(), // 'inventory', 'optimization', 'maintenance', 'expansion'
  priority: varchar("priority").notNull().default("medium"), // 'high', 'medium', 'low'
  estimatedImpact: varchar("estimated_impact"), // financial or operational impact
  status: varchar("status").default("pending"), // 'pending', 'implemented', 'dismissed'
  createdAt: timestamp("created_at").defaultNow()
});

// Extended Automation Tables
export const automationRules = pgTable("automation_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ruleName: varchar("rule_name").notNull(),
  category: varchar("category").notNull(), // 'inventory', 'production', 'maintenance', 'quality', 'distribution'
  triggerType: varchar("trigger_type").notNull(), // 'threshold', 'schedule', 'event', 'predictive'
  triggerCondition: jsonb("trigger_condition").notNull(), // flexible condition data
  actionType: varchar("action_type").notNull(), // 'reorder', 'schedule', 'alert', 'optimize', 'adjust'
  actionParameters: jsonb("action_parameters").notNull(), // action configuration
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(2), // 1=high, 2=medium, 3=low
  lastTriggered: timestamp("last_triggered"),
  executionCount: integer("execution_count").default(0),
  successRate: varchar("success_rate").default("0.00"), // percentage as string
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const automationEvents = pgTable("automation_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ruleId: varchar("rule_id").notNull().references(() => automationRules.id),
  eventType: varchar("event_type").notNull(), // 'triggered', 'executed', 'failed', 'completed'
  status: varchar("status").notNull(), // 'success', 'failed', 'pending', 'cancelled'
  triggerData: jsonb("trigger_data"), // data that triggered the rule
  result: jsonb("result"), // execution result or error details
  executionTime: integer("execution_time"), // milliseconds
  createdAt: timestamp("created_at").defaultNow(),
});

export const maintenanceSchedules = pgTable("maintenance_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  equipmentName: varchar("equipment_name").notNull(),
  maintenanceType: varchar("maintenance_type").notNull(), // 'preventive', 'predictive', 'corrective'
  factoryId: varchar("factory_id").references(() => factorySetups.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  estimatedDuration: integer("estimated_duration"), // minutes
  priority: varchar("priority").notNull().default("medium"), // 'high', 'medium', 'low'
  status: varchar("status").notNull().default("scheduled"), // 'scheduled', 'in_progress', 'completed', 'cancelled'
  assignedTechnician: varchar("assigned_technician"),
  checklist: jsonb("checklist"), // maintenance tasks
  notes: text("notes"),
  cost: varchar("cost").default("0.00"), // cost as string for precision
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const salesRepsRelations = relations(salesReps, ({ many }) => ({
  routePlans: many(routePlans),
  storeVisits: many(storeVisits),
}));

export const hardwareStoresRelations = relations(hardwareStores, ({ many }) => ({
  routeStores: many(routeStores),
  aiOrderSuggestions: many(aiOrderSuggestions),
  storeVisits: many(storeVisits),
}));

export const routePlansRelations = relations(routePlans, ({ one, many }) => ({
  salesRep: one(salesReps, { fields: [routePlans.salesRepId], references: [salesReps.id] }),
  routeStores: many(routeStores),
}));

export const routeStoresRelations = relations(routeStores, ({ one }) => ({
  routePlan: one(routePlans, { fields: [routeStores.routePlanId], references: [routePlans.id] }),
  hardwareStore: one(hardwareStores, { fields: [routeStores.hardwareStoreId], references: [hardwareStores.id] }),
}));

export const aiOrderSuggestionsRelations = relations(aiOrderSuggestions, ({ one }) => ({
  hardwareStore: one(hardwareStores, { fields: [aiOrderSuggestions.hardwareStoreId], references: [hardwareStores.id] }),
  product: one(products, { fields: [aiOrderSuggestions.productId], references: [products.id] }),
}));

export const storeVisitsRelations = relations(storeVisits, ({ one }) => ({
  hardwareStore: one(hardwareStores, { fields: [storeVisits.hardwareStoreId], references: [hardwareStores.id] }),
  salesRep: one(salesReps, { fields: [storeVisits.salesRepId], references: [salesReps.id] }),
}));

// Factory relations
export const factorySetupsRelations = relations(factorySetups, ({ many }) => ({
  aiInsights: many(aiInsights),
  productionMetrics: many(productionMetrics),
  recommendations: many(factoryRecommendations),
}));

export const aiInsightsRelations = relations(aiInsights, ({ one }) => ({
  factory: one(factorySetups, { fields: [aiInsights.factoryId], references: [factorySetups.id] }),
}));

export const productionMetricsRelations = relations(productionMetrics, ({ one }) => ({
  factory: one(factorySetups, { fields: [productionMetrics.factoryId], references: [factorySetups.id] }),
}));

export const factoryRecommendationsRelations = relations(factoryRecommendations, ({ one }) => ({
  factory: one(factorySetups, { fields: [factoryRecommendations.factoryId], references: [factorySetups.id] }),
}));

export const automationRulesRelations = relations(automationRules, ({ many }) => ({
  events: many(automationEvents),
}));

export const automationEventsRelations = relations(automationEvents, ({ one }) => ({
  rule: one(automationRules, { fields: [automationEvents.ruleId], references: [automationRules.id] }),
}));

export const maintenanceSchedulesRelations = relations(maintenanceSchedules, ({ one }) => ({
  factory: one(factorySetups, { fields: [maintenanceSchedules.factoryId], references: [factorySetups.id] }),
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
export const insertSalesRepSchema = createInsertSchema(salesReps).omit({ id: true, createdAt: true });
export const insertHardwareStoreSchema = createInsertSchema(hardwareStores).omit({ id: true, createdAt: true });
export const insertRoutePlanSchema = createInsertSchema(routePlans).omit({ id: true, createdAt: true });
export const insertRouteStoreSchema = createInsertSchema(routeStores).omit({ id: true });
export const insertAiOrderSuggestionSchema = createInsertSchema(aiOrderSuggestions).omit({ id: true, createdAt: true });
export const insertStoreVisitSchema = createInsertSchema(storeVisits).omit({ id: true, createdAt: true });

// Factory schemas
export const insertFactorySetupSchema = createInsertSchema(factorySetups).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAiInsightSchema = createInsertSchema(aiInsights).omit({ id: true, createdAt: true });
export const insertProductionMetricsSchema = createInsertSchema(productionMetrics).omit({ id: true, createdAt: true });
export const insertFactoryRecommendationSchema = createInsertSchema(factoryRecommendations).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
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
export type SalesRep = typeof salesReps.$inferSelect;
export type InsertSalesRep = z.infer<typeof insertSalesRepSchema>;
export type HardwareStore = typeof hardwareStores.$inferSelect;
export type InsertHardwareStore = z.infer<typeof insertHardwareStoreSchema>;
export type RoutePlan = typeof routePlans.$inferSelect;
export type InsertRoutePlan = z.infer<typeof insertRoutePlanSchema>;
export type RouteStore = typeof routeStores.$inferSelect;
export type InsertRouteStore = z.infer<typeof insertRouteStoreSchema>;
export type AiOrderSuggestion = typeof aiOrderSuggestions.$inferSelect;
export type InsertAiOrderSuggestion = z.infer<typeof insertAiOrderSuggestionSchema>;
export type StoreVisit = typeof storeVisits.$inferSelect;
export type InsertStoreVisit = z.infer<typeof insertStoreVisitSchema>;

// Factory types
export type FactorySetup = typeof factorySetups.$inferSelect;
export type InsertFactorySetup = z.infer<typeof insertFactorySetupSchema>;
export type AiInsight = typeof aiInsights.$inferSelect;
export type InsertAiInsight = z.infer<typeof insertAiInsightSchema>;
export type ProductionMetrics = typeof productionMetrics.$inferSelect;
export type InsertProductionMetrics = z.infer<typeof insertProductionMetricsSchema>;
export type FactoryRecommendation = typeof factoryRecommendations.$inferSelect;

// Extended Automation Types
export const insertAutomationRuleSchema = createInsertSchema(automationRules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAutomationEventSchema = createInsertSchema(automationEvents).omit({ id: true, createdAt: true });
export const insertMaintenanceScheduleSchema = createInsertSchema(maintenanceSchedules).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertAutomationRule = z.infer<typeof insertAutomationRuleSchema>;
export type InsertAutomationEvent = z.infer<typeof insertAutomationEventSchema>;
export type InsertMaintenanceSchedule = z.infer<typeof insertMaintenanceScheduleSchema>;

export type AutomationRule = typeof automationRules.$inferSelect;
export type AutomationEvent = typeof automationEvents.$inferSelect;
export type MaintenanceSchedule = typeof maintenanceSchedules.$inferSelect;
export type InsertFactoryRecommendation = z.infer<typeof insertFactoryRecommendationSchema>;

// Excel Upload Tables
export const excelUploads = pgTable("excel_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: varchar("file_name").notNull(),
  mappedName: varchar("mapped_name").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed
  storesCount: integer("stores_count").default(0),
  routesCount: integer("routes_count").default(0),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
});

export const hardwareStoresFromExcel = pgTable("hardware_stores_from_excel", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uploadId: varchar("upload_id").references(() => excelUploads.id),
  storeName: varchar("store_name").notNull(),
  storeAddress: text("store_address"),
  cityTown: varchar("city_town"),
  province: varchar("province"),
  contactPerson: varchar("contact_person"),
  phoneNumber: varchar("phone_number"),
  repName: varchar("rep_name"),
  visitFrequency: varchar("visit_frequency"),
  mappedToCornex: varchar("mapped_to_cornex").notNull(), // The Cornex mapping
  createdAt: timestamp("created_at").defaultNow(),
});

export const salesRepRoutesFromExcel = pgTable("sales_rep_routes_from_excel", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  uploadId: varchar("upload_id").references(() => excelUploads.id),
  repName: varchar("rep_name").notNull(),
  routeName: varchar("route_name"),
  storeId: varchar("store_id").references(() => hardwareStoresFromExcel.id),
  visitDay: varchar("visit_day"),
  visitFrequency: varchar("visit_frequency"),
  priority: integer("priority").default(1),
  mappedToCornex: varchar("mapped_to_cornex").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Excel upload relations
export const excelUploadsRelations = relations(excelUploads, ({ many }) => ({
  hardwareStores: many(hardwareStoresFromExcel),
  salesRepRoutes: many(salesRepRoutesFromExcel),
}));

export const hardwareStoresFromExcelRelations = relations(hardwareStoresFromExcel, ({ one, many }) => ({
  upload: one(excelUploads, { fields: [hardwareStoresFromExcel.uploadId], references: [excelUploads.id] }),
  routes: many(salesRepRoutesFromExcel),
}));

export const salesRepRoutesFromExcelRelations = relations(salesRepRoutesFromExcel, ({ one }) => ({
  upload: one(excelUploads, { fields: [salesRepRoutesFromExcel.uploadId], references: [excelUploads.id] }),
  store: one(hardwareStoresFromExcel, { fields: [salesRepRoutesFromExcel.storeId], references: [hardwareStoresFromExcel.id] }),
}));

// Excel upload schemas
export const insertExcelUploadSchema = createInsertSchema(excelUploads).omit({ id: true, uploadedAt: true });
export const insertHardwareStoreFromExcelSchema = createInsertSchema(hardwareStoresFromExcel).omit({ id: true, createdAt: true });

// Product Labeling and Inserts Library System
export const productLabels = pgTable("product_labels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  productId: varchar("product_id").references(() => products.id),
  category: text("category").notNull(), // product_label, insert_card, packaging_label, barcode_label, safety_label
  labelType: text("label_type").notNull(), // standard, custom, regulatory, promotional
  fileUrl: text("file_url").notNull(), // Object storage path to PDF
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  printSize: text("print_size").notNull(), // A4, A5, 4x6, custom
  printOrientation: text("print_orientation").notNull().default("portrait"), // portrait, landscape
  printQuality: text("print_quality").notNull().default("high"), // draft, normal, high, photo
  colorMode: text("color_mode").notNull().default("color"), // bw, color
  copies: integer("copies").default(1),
  isActive: boolean("is_active").default(true),
  version: text("version").default("1.0"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const printers = pgTable("printers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  model: text("model"),
  manufacturer: text("manufacturer"),
  ipAddress: text("ip_address").notNull(),
  macAddress: text("mac_address"),
  location: text("location").notNull(),
  department: text("department"),
  printerType: text("printer_type").notNull(), // laser, inkjet, thermal, dot_matrix
  connectionType: text("connection_type").notNull().default("wifi"), // wifi, ethernet, usb
  supportedSizes: jsonb("supported_sizes").notNull(), // ["A4", "A5", "4x6"]
  capabilities: jsonb("capabilities").notNull(), // {"color": true, "duplex": true, "staple": false}
  status: text("status").notNull().default("offline"), // online, offline, printing, error, maintenance
  paperLevel: integer("paper_level").default(100), // Percentage
  tonerLevel: integer("toner_level").default(100), // Percentage
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  lastPingAt: timestamp("last_ping_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const printJobs = pgTable("print_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  labelId: varchar("label_id").notNull().references(() => productLabels.id),
  printerId: varchar("printer_id").notNull().references(() => printers.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobName: text("job_name").notNull(),
  copies: integer("copies").notNull().default(1),
  printSize: text("print_size").notNull(),
  printOrientation: text("print_orientation").notNull().default("portrait"),
  printQuality: text("print_quality").notNull().default("normal"),
  colorMode: text("color_mode").notNull().default("color"),
  status: text("status").notNull().default("queued"), // queued, printing, completed, failed, cancelled
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  estimatedPages: integer("estimated_pages").default(1),
  actualPages: integer("actual_pages").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"), // Additional print settings
  createdAt: timestamp("created_at").defaultNow(),
});

export const labelTemplates = pgTable("label_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // product_info, pricing, promotional, regulatory, custom
  templateType: text("template_type").notNull(), // pdf_template, design_template
  templateUrl: text("template_url").notNull(), // Object storage path
  previewUrl: text("preview_url"), // Preview image path
  fields: jsonb("fields").notNull(), // Editable fields configuration
  defaultValues: jsonb("default_values"), // Default field values
  printSettings: jsonb("print_settings").notNull(), // Size, orientation, margins
  isPublic: boolean("is_public").default(false), // Available to all users
  usageCount: integer("usage_count").default(0),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for product labeling
export const productLabelsRelations = relations(productLabels, ({ one, many }) => ({
  product: one(products, { fields: [productLabels.productId], references: [products.id] }),
  creator: one(users, { fields: [productLabels.createdBy], references: [users.id] }),
  printJobs: many(printJobs),
}));

export const printersRelations = relations(printers, ({ many }) => ({
  printJobs: many(printJobs),
}));

export const printJobsRelations = relations(printJobs, ({ one }) => ({
  label: one(productLabels, { fields: [printJobs.labelId], references: [productLabels.id] }),
  printer: one(printers, { fields: [printJobs.printerId], references: [printers.id] }),
  user: one(users, { fields: [printJobs.userId], references: [users.id] }),
}));

export const labelTemplatesRelations = relations(labelTemplates, ({ one }) => ({
  creator: one(users, { fields: [labelTemplates.createdBy], references: [users.id] }),
}));

// Product labeling insert schemas
export const insertProductLabelSchema = createInsertSchema(productLabels).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPrinterSchema = createInsertSchema(printers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPrintJobSchema = createInsertSchema(printJobs).omit({ id: true, createdAt: true });
export const insertLabelTemplateSchema = createInsertSchema(labelTemplates).omit({ id: true, createdAt: true, updatedAt: true });

// Product labeling types
export type ProductLabel = typeof productLabels.$inferSelect;
export type InsertProductLabel = z.infer<typeof insertProductLabelSchema>;
export type Printer = typeof printers.$inferSelect;
export type InsertPrinter = z.infer<typeof insertPrinterSchema>;
export type PrintJob = typeof printJobs.$inferSelect;
export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
export type LabelTemplate = typeof labelTemplates.$inferSelect;
export type InsertLabelTemplate = z.infer<typeof insertLabelTemplateSchema>;

export const insertSalesRepRouteFromExcelSchema = createInsertSchema(salesRepRoutesFromExcel).omit({ id: true, createdAt: true });

// Excel upload types
export type ExcelUpload = typeof excelUploads.$inferSelect;
export type InsertExcelUpload = z.infer<typeof insertExcelUploadSchema>;
export type HardwareStoreFromExcel = typeof hardwareStoresFromExcel.$inferSelect;
export type InsertHardwareStoreFromExcel = z.infer<typeof insertHardwareStoreFromExcelSchema>;
export type SalesRepRouteFromExcel = typeof salesRepRoutesFromExcel.$inferSelect;
export type InsertSalesRepRouteFromExcel = z.infer<typeof insertSalesRepRouteFromExcelSchema>;

// AI-Powered Mood Selector Database Tables
export const userMoodPreferences = pgTable("user_mood_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moodId: text("mood_id").notNull(), // energetic, focused, creative, calm, productive
  moodName: text("mood_name").notNull(),
  energyLevel: integer("energy_level").notNull().default(50), // 0-100
  focusLevel: integer("focus_level").notNull().default(50), // 0-100
  creativityLevel: integer("creativity_level").notNull().default(50), // 0-100
  isDefault: boolean("is_default").default(false),
  isAdaptive: boolean("is_adaptive").default(false),
  transitionSettings: jsonb("transition_settings"), // duration, easing, etc.
  aiRecommended: boolean("ai_recommended").default(false),
  usageCount: integer("usage_count").default(0),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userMoodHistory = pgTable("user_mood_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  moodId: text("mood_id").notNull(),
  moodName: text("mood_name").notNull(),
  timeOfDay: text("time_of_day"), // morning, afternoon, evening, night
  dayOfWeek: text("day_of_week"), // monday, tuesday, etc.
  sessionDuration: integer("session_duration"), // minutes
  contextData: jsonb("context_data"), // page visited, actions taken, etc.
  aiAnalysis: jsonb("ai_analysis"), // OpenAI mood analysis results
  satisfaction: integer("satisfaction"), // 1-5 rating (if provided)
  timestamp: timestamp("timestamp").defaultNow(),
});

export const aiMoodAnalytics = pgTable("ai_mood_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  analysisType: text("analysis_type").notNull(), // daily_pattern, weekly_trend, productivity_correlation
  insights: jsonb("insights"), // AI-generated insights
  recommendations: jsonb("recommendations"), // suggested mood adjustments
  confidence: integer("confidence"), // 0-100 AI confidence score
  dataPoints: integer("data_points"), // number of sessions analyzed
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Mood selector relations
export const userMoodPreferencesRelations = relations(userMoodPreferences, ({ one, many }) => ({
  user: one(users, { fields: [userMoodPreferences.userId], references: [users.id] }),
  history: many(userMoodHistory),
}));

export const userMoodHistoryRelations = relations(userMoodHistory, ({ one }) => ({
  user: one(users, { fields: [userMoodHistory.userId], references: [users.id] }),
  preference: one(userMoodPreferences, { 
    fields: [userMoodHistory.userId, userMoodHistory.moodId], 
    references: [userMoodPreferences.userId, userMoodPreferences.moodId] 
  }),
}));

export const aiMoodAnalyticsRelations = relations(aiMoodAnalytics, ({ one }) => ({
  user: one(users, { fields: [aiMoodAnalytics.userId], references: [users.id] }),
}));

// Mood selector schemas
export const insertUserMoodPreferenceSchema = createInsertSchema(userMoodPreferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserMoodHistorySchema = createInsertSchema(userMoodHistory).omit({ id: true, timestamp: true });
export const insertAiMoodAnalyticsSchema = createInsertSchema(aiMoodAnalytics).omit({ id: true, generatedAt: true });

// Mood selector types
export type UserMoodPreference = typeof userMoodPreferences.$inferSelect;
export type InsertUserMoodPreference = z.infer<typeof insertUserMoodPreferenceSchema>;
export type UserMoodHistory = typeof userMoodHistory.$inferSelect;
export type InsertUserMoodHistory = z.infer<typeof insertUserMoodHistorySchema>;
export type AiMoodAnalytics = typeof aiMoodAnalytics.$inferSelect;
export type InsertAiMoodAnalytics = z.infer<typeof insertAiMoodAnalyticsSchema>;

// Bulk Import Sessions table (for tracking file uploads)
export const bulkImportSessions = pgTable("bulk_import_sessions", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
  totalFiles: integer("total_files").notNull().default(0),
  processedFiles: integer("processed_files").notNull().default(0),
  totalImported: integer("total_imported").default(0),
  status: varchar("status").notNull().default("active"), // active, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  files: jsonb("files").notNull().default("[]"), // Store file processing details as JSON
});

export const insertBulkImportSessionSchema = createInsertSchema(bulkImportSessions).omit({ createdAt: true, updatedAt: true });
export type BulkImportSession = typeof bulkImportSessions.$inferSelect;
export type InsertBulkImportSession = z.infer<typeof insertBulkImportSessionSchema>;

// Authentication and User Management Tables
export const userRegistrations = pgTable("user_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  companyName: varchar("company_name").notNull(),
  companyRegistration: varchar("company_registration"),
  phone: varchar("phone"),
  role: text("role").notNull().default("admin"), // admin, manager, user
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  verificationCode: varchar("verification_code"),
  verificationExpiry: timestamp("verification_expiry"),
  registeredAt: timestamp("registered_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
});

export const userAuditTrail = pgTable("user_audit_trail", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(), // login, logout, register, update_profile, password_change, etc.
  details: text("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const companySettings = pgTable("company_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  companyName: varchar("company_name").notNull(),
  companyRegistration: varchar("company_registration"),
  contactEmail: varchar("contact_email").notNull(),
  alternateEmail: varchar("alternate_email"),
  phone: varchar("phone"),
  alternatePhone: varchar("alternate_phone"),
  address: text("address"),
  city: varchar("city"),
  province: varchar("province"),
  postalCode: varchar("postal_code"),
  country: varchar("country").default("South Africa"),
  vatNumber: varchar("vat_number"),
  bankDetails: jsonb("bank_details"), // Store bank account info securely
  businessType: text("business_type"), // distributor, retailer, manufacturer
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }).default("0"),
  paymentTerms: text("payment_terms").default("30_days"), // 30_days, 60_days, cash
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations for new tables
export const userRegistrationsRelations = relations(userRegistrations, ({ one }) => ({
  approver: one(users, { fields: [userRegistrations.approvedBy], references: [users.id] }),
}));

export const userAuditTrailRelations = relations(userAuditTrail, ({ one }) => ({
  user: one(users, { fields: [userAuditTrail.userId], references: [users.id] }),
}));

export const companySettingsRelations = relations(companySettings, ({ one }) => ({
  user: one(users, { fields: [companySettings.userId], references: [users.id] }),
}));

// Schema types for new tables
export const insertUserRegistrationSchema = createInsertSchema(userRegistrations).omit({ id: true, registeredAt: true });
export const insertUserAuditTrailSchema = createInsertSchema(userAuditTrail).omit({ id: true, timestamp: true });
export const insertCompanySettingsSchema = createInsertSchema(companySettings).omit({ id: true, createdAt: true, updatedAt: true });

export type UserRegistration = typeof userRegistrations.$inferSelect;
export type InsertUserRegistration = z.infer<typeof insertUserRegistrationSchema>;
export type UserAuditTrail = typeof userAuditTrail.$inferSelect;
export type InsertUserAuditTrail = z.infer<typeof insertUserAuditTrailSchema>;
export type CompanySettings = typeof companySettings.$inferSelect;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;

// Purchase Order System Tables
export const purchaseOrders = pgTable("purchase_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poNumber: varchar("po_number").notNull().unique(), // Auto-generated PO number
  customerId: varchar("customer_id"), // Can reference distributors or be standalone
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  customerAddress: text("customer_address"),
  customerCity: text("customer_city"),
  customerRegion: text("customer_region"),
  customerCountry: text("customer_country").notNull(),
  
  // Order details
  orderDate: timestamp("order_date").defaultNow(),
  requestedDeliveryDate: timestamp("requested_delivery_date"),
  urgencyLevel: text("urgency_level").notNull().default("standard"), // urgent, high, standard, low
  currency: text("currency").notNull().default("ZAR"),
  
  // Pricing
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  shippingCost: decimal("shipping_cost", { precision: 12, scale: 2 }).notNull().default("0"),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  
  // Status and workflow
  status: text("status").notNull().default("pending"), // pending, approved, in_production, ready_to_ship, shipped, delivered, cancelled
  approvedBy: varchar("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  internalNotes: text("internal_notes"), // Private notes for internal use
  
  // Tracking
  assignedTo: varchar("assigned_to").references(() => users.id), // Sales rep or manager handling this PO
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  
  // Metadata
  source: text("source").notNull().default("manual"), // manual, excel_upload, api, website
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  
  // Item details
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("line_total", { precision: 12, scale: 2 }).notNull(),
  
  // Production details
  estimatedProductionTime: integer("estimated_production_time"), // in hours
  actualProductionTime: integer("actual_production_time"), // in hours
  productionStatus: text("production_status").default("not_started"), // not_started, in_progress, completed
  
  // Special requirements
  customSpecifications: text("custom_specifications"),
  packagingNotes: text("packaging_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const poStatusHistory = pgTable("po_status_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  changedBy: varchar("changed_by").references(() => users.id),
  changeReason: text("change_reason"),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const poDocuments = pgTable("po_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  purchaseOrderId: varchar("purchase_order_id").notNull().references(() => purchaseOrders.id, { onDelete: "cascade" }),
  documentType: text("document_type").notNull(), // invoice, receipt, shipping_label, custom_specs
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Purchase Order Relations
export const purchaseOrdersRelations = relations(purchaseOrders, ({ one, many }) => ({
  items: many(purchaseOrderItems),
  statusHistory: many(poStatusHistory),
  documents: many(poDocuments),
  approver: one(users, { fields: [purchaseOrders.approvedBy], references: [users.id] }),
  assignee: one(users, { fields: [purchaseOrders.assignedTo], references: [users.id] }),
  creator: one(users, { fields: [purchaseOrders.createdBy], references: [users.id] }),
}));

export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, { fields: [purchaseOrderItems.purchaseOrderId], references: [purchaseOrders.id] }),
  product: one(products, { fields: [purchaseOrderItems.productId], references: [products.id] }),
}));

export const poStatusHistoryRelations = relations(poStatusHistory, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, { fields: [poStatusHistory.purchaseOrderId], references: [purchaseOrders.id] }),
  changedBy: one(users, { fields: [poStatusHistory.changedBy], references: [users.id] }),
}));

export const poDocumentsRelations = relations(poDocuments, ({ one }) => ({
  purchaseOrder: one(purchaseOrders, { fields: [poDocuments.purchaseOrderId], references: [purchaseOrders.id] }),
  uploadedBy: one(users, { fields: [poDocuments.uploadedBy], references: [users.id] }),
}));

// Purchase Order Zod Schemas
export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).extend({
  orderDate: z.coerce.date().optional(),
  requestedDeliveryDate: z.coerce.date().optional(),
  estimatedCompletionDate: z.coerce.date().optional(),
  actualCompletionDate: z.coerce.date().optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({ id: true, createdAt: true });
export const insertPoStatusHistorySchema = createInsertSchema(poStatusHistory).omit({ id: true, timestamp: true });
export const insertPoDocumentSchema = createInsertSchema(poDocuments).omit({ id: true, uploadedAt: true });

export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertPoStatusHistory = typeof poStatusHistory.$inferInsert;
export type PoStatusHistory = typeof poStatusHistory.$inferSelect;
export type InsertPoDocument = typeof poDocuments.$inferInsert;
export type PoDocument = typeof poDocuments.$inferSelect;

// Gamified Achievement System for Import Accuracy
export const importAchievements = pgTable("import_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type").notNull(), // 'accuracy', 'volume', 'streak', 'speed', 'quality'
  achievementName: varchar("achievement_name").notNull(),
  description: text("description").notNull(),
  iconType: varchar("icon_type").notNull(), // 'trophy', 'medal', 'star', 'crown', 'gem'
  level: integer("level").notNull().default(1), // Bronze=1, Silver=2, Gold=3, Platinum=4, Diamond=5
  pointsAwarded: integer("points_awarded").notNull().default(0),
  criteria: jsonb("criteria").notNull(), // Achievement criteria and thresholds
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const userAchievementProgress = pgTable("user_achievement_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementType: varchar("achievement_type").notNull(),
  currentProgress: integer("current_progress").notNull().default(0),
  targetProgress: integer("target_progress").notNull(),
  level: integer("level").notNull().default(1),
  totalPoints: integer("total_points").notNull().default(0),
  lastImportAccuracy: decimal("last_import_accuracy", { precision: 5, scale: 2 }).default("0.00"),
  bestAccuracy: decimal("best_accuracy", { precision: 5, scale: 2 }).default("0.00"),
  consecutiveSuccessfulImports: integer("consecutive_successful_imports").notNull().default(0),
  totalImports: integer("total_imports").notNull().default(0),
  totalRecordsImported: integer("total_records_imported").notNull().default(0),
  averageImportTime: integer("average_import_time").notNull().default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const importAccuracyMetrics = pgTable("import_accuracy_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sessionId: varchar("session_id").notNull(),
  fileName: varchar("file_name").notNull(),
  totalRows: integer("total_rows").notNull(),
  validRows: integer("valid_rows").notNull(),
  errorRows: integer("error_rows").notNull(),
  accuracyPercentage: decimal("accuracy_percentage", { precision: 5, scale: 2 }).notNull(),
  importDuration: integer("import_duration").notNull(), // in seconds
  qualityScore: integer("quality_score").notNull().default(0), // 0-100
  errorsDetected: jsonb("errors_detected"),
  improvementSuggestions: jsonb("improvement_suggestions"),
  pointsEarned: integer("points_earned").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievement System Relations
export const importAchievementsRelations = relations(importAchievements, ({ one }) => ({
  user: one(users, { fields: [importAchievements.userId], references: [users.id] }),
}));

export const userAchievementProgressRelations = relations(userAchievementProgress, ({ one }) => ({
  user: one(users, { fields: [userAchievementProgress.userId], references: [users.id] }),
}));

export const importAccuracyMetricsRelations = relations(importAccuracyMetrics, ({ one }) => ({
  user: one(users, { fields: [importAccuracyMetrics.userId], references: [users.id] }),
}));

// Achievement System Schemas
export const insertImportAchievementSchema = createInsertSchema(importAchievements).omit({ id: true, unlockedAt: true });
export const insertUserAchievementProgressSchema = createInsertSchema(userAchievementProgress).omit({ id: true, createdAt: true, updatedAt: true });
export const insertImportAccuracyMetricsSchema = createInsertSchema(importAccuracyMetrics).omit({ id: true, createdAt: true });

// Achievement System Types
export type ImportAchievement = typeof importAchievements.$inferSelect;
export type InsertImportAchievement = z.infer<typeof insertImportAchievementSchema>;
export type UserAchievementProgress = typeof userAchievementProgress.$inferSelect;
export type InsertUserAchievementProgress = z.infer<typeof insertUserAchievementProgressSchema>;
export type ImportAccuracyMetrics = typeof importAccuracyMetrics.$inferSelect;
export type InsertImportAccuracyMetrics = z.infer<typeof insertImportAccuracyMetricsSchema>;


