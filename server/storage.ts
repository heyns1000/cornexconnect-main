import { 
  users, products, inventory, distributors, orders, orderItems, 
  productionSchedule, demandForecast, salesMetrics, brands,
  salesReps, hardwareStores, routePlans, routeStores, aiOrderSuggestions, storeVisits,
  factorySetups, aiInsights, productionMetrics, factoryRecommendations,
  automationRules, automationEvents, maintenanceSchedules,
  excelUploads, hardwareStoresFromExcel, salesRepRoutesFromExcel,
  purchaseOrders, purchaseOrderItems, poStatusHistory, poDocuments,
  companySettings, userAuditTrail, bulkImportSessions,
  type User, type InsertUser, type UpsertUser, type Product, type InsertProduct,
  type Inventory, type InsertInventory, type Distributor, type InsertDistributor,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type ProductionSchedule, type InsertProductionSchedule,
  type DemandForecast, type InsertDemandForecast,
  type SalesMetrics, type InsertSalesMetrics,
  type Brand, type InsertBrand,
  type SalesRep, type InsertSalesRep,
  type HardwareStore, type InsertHardwareStore,
  type RoutePlan, type InsertRoutePlan,
  type RouteStore, type InsertRouteStore,
  type AiOrderSuggestion, type InsertAiOrderSuggestion,
  type StoreVisit, type InsertStoreVisit,
  type FactorySetup, type InsertFactorySetup,
  type AiInsight, type InsertAiInsight,
  type ProductionMetrics, type InsertProductionMetrics,
  type FactoryRecommendation, type InsertFactoryRecommendation,
  type AutomationRule, type InsertAutomationRule,
  type AutomationEvent, type InsertAutomationEvent,
  type MaintenanceSchedule, type InsertMaintenanceSchedule,
  type PurchaseOrder, type InsertPurchaseOrder,
  type PurchaseOrderItem, type InsertPurchaseOrderItem,
  type PoStatusHistory, type InsertPoStatusHistory,
  type PoDocument, type InsertPoDocument,
  type BulkImportSession, type InsertBulkImportSession,
  type CompanySettings, type InsertCompanySettings,
  type UserAuditTrail, type InsertUserAuditTrail,
  productLabels, printers, printJobs, labelTemplates,
  type ProductLabel, type InsertProductLabel,
  type Printer, type InsertPrinter,
  type PrintJob, type InsertPrintJob,
  type LabelTemplate, type InsertLabelTemplate,
  userMoodPreferences,
  type UserMoodPreference,
  type InsertUserMoodPreference,
  userMoodHistory,
  type UserMoodHistory,
  type InsertUserMoodHistory,
  aiMoodAnalytics,
  type AiMoodAnalytics,
  type InsertAiMoodAnalytics
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, asc, and, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Company Settings (Database-first implementation)
  getCompanySettings(): Promise<CompanySettings | undefined>;
  updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings>;
  
  // User Management (Database-first implementation)  
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Audit Trail (Database-first implementation)
  getAuditLogs(filters?: any): Promise<UserAuditTrail[]>;
  createAuditLog(log: InsertUserAuditTrail): Promise<UserAuditTrail>;

  // AI-Powered Mood Selector System (Database-first implementation)
  getUserMoodPreferences(userId: string): Promise<UserMoodPreference[]>;
  getUserMoodPreference(userId: string, moodId: string): Promise<UserMoodPreference | undefined>;
  createUserMoodPreference(preference: InsertUserMoodPreference): Promise<UserMoodPreference>;
  updateUserMoodPreference(id: string, preference: Partial<InsertUserMoodPreference>): Promise<UserMoodPreference>;
  deleteUserMoodPreference(id: string): Promise<boolean>;
  getUserMoodHistory(userId: string, filters?: { limit?: number; moodId?: string; timeRange?: { start: Date; end: Date } }): Promise<UserMoodHistory[]>;
  createUserMoodHistory(history: InsertUserMoodHistory): Promise<UserMoodHistory>;
  getAiMoodAnalytics(userId: string, analysisType?: string): Promise<AiMoodAnalytics[]>;
  createAiMoodAnalytics(analytics: InsertAiMoodAnalytics): Promise<AiMoodAnalytics>;
  findUsersByMoodPattern(pattern: { moodId?: string; timeOfDay?: string; dayOfWeek?: string }): Promise<User[]>;
  updateMoodUsageStats(userId: string, moodId: string): Promise<void>;
  
  // Product Labeling System
  getProductLabels(): Promise<ProductLabel[]>;
  getProductLabel(id: string): Promise<ProductLabel | undefined>;
  createProductLabel(label: InsertProductLabel): Promise<ProductLabel>;
  updateProductLabel(id: string, label: Partial<InsertProductLabel>): Promise<ProductLabel>;
  deleteProductLabel(id: string): Promise<boolean>;
  
  // Printers
  getPrinters(): Promise<Printer[]>;
  getPrinter(id: string): Promise<Printer | undefined>;
  createPrinter(printer: InsertPrinter): Promise<Printer>;
  updatePrinter(id: string, printer: Partial<InsertPrinter>): Promise<Printer>;
  deletePrinter(id: string): Promise<boolean>;
  
  // Print Jobs
  getPrintJobs(): Promise<PrintJob[]>;
  getPrintJob(id: string): Promise<PrintJob | undefined>;
  getPrintJobsByPrinter(printerId: string): Promise<PrintJob[]>;
  getPrintJobsByUser(userId: string): Promise<PrintJob[]>;
  createPrintJob(job: InsertPrintJob): Promise<PrintJob>;
  updatePrintJobStatus(id: string, status: string): Promise<PrintJob>;
  
  // Label Templates
  getLabelTemplates(): Promise<LabelTemplate[]>;
  getLabelTemplate(id: string): Promise<LabelTemplate | undefined>;
  createLabelTemplate(template: InsertLabelTemplate): Promise<LabelTemplate>;
  // Users (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Inventory
  getInventory(): Promise<(Inventory & { product: Product })[]>;
  getInventoryByProduct(productId: string): Promise<Inventory | undefined>;
  updateInventory(productId: string, inventory: Partial<InsertInventory>): Promise<Inventory>;
  
  // Distributors
  getDistributors(): Promise<Distributor[]>;
  getDistributor(id: string): Promise<Distributor | undefined>;
  createDistributor(distributor: InsertDistributor): Promise<Distributor>;
  updateDistributor(id: string, distributor: Partial<InsertDistributor>): Promise<Distributor>;
  getDistributorsByRegion(region: string): Promise<Distributor[]>;
  
  // Orders
  getOrders(): Promise<(Order & { distributor: Distributor })[]>;
  getOrder(id: string): Promise<(Order & { distributor: Distributor; items: (OrderItem & { product: Product })[] }) | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrdersByDistributor(distributorId: string): Promise<Order[]>;
  
  // Production Schedule
  getProductionSchedule(): Promise<(ProductionSchedule & { product: Product })[]>;
  createProductionSchedule(schedule: InsertProductionSchedule): Promise<ProductionSchedule>;
  updateProductionSchedule(id: string, schedule: Partial<InsertProductionSchedule>): Promise<ProductionSchedule>;
  getProductionScheduleByDate(startDate: Date, endDate: Date): Promise<(ProductionSchedule & { product: Product })[]>;
  
  // Demand Forecast
  getDemandForecast(productId?: string, region?: string): Promise<(DemandForecast & { product: Product })[]>;
  createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast>;
  
  // Sales Metrics
  getSalesMetrics(startDate?: Date, endDate?: Date, region?: string): Promise<SalesMetrics[]>;
  createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics>;
  getSalesMetricsByRegion(): Promise<{ region: string; revenue: string; units: number }[]>;
  getTopProducts(limit?: number): Promise<{ product: Product; revenue: string; units: number }[]>;
  
  // Brands
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  
  // Sales Reps
  getSalesReps(): Promise<SalesRep[]>;
  getSalesRep(id: string): Promise<SalesRep | undefined>;
  createSalesRep(rep: InsertSalesRep): Promise<SalesRep>;
  
  // Hardware Stores
  getHardwareStores(): Promise<HardwareStore[]>;
  getHardwareStore(id: string): Promise<HardwareStore | undefined>;
  createHardwareStore(store: InsertHardwareStore): Promise<HardwareStore>;
  getHardwareStoresByProvince(province: string): Promise<HardwareStore[]>;
  
  // Route Plans
  getRoutePlans(): Promise<(RoutePlan & { salesRep: SalesRep })[]>;
  getRoutePlan(id: string): Promise<(RoutePlan & { salesRep: SalesRep; routeStores: (RouteStore & { hardwareStore: HardwareStore })[] }) | undefined>;
  createRoutePlan(route: InsertRoutePlan): Promise<RoutePlan>;
  
  // AI Order Suggestions
  getAiOrderSuggestions(): Promise<(AiOrderSuggestion & { hardwareStore: HardwareStore; product: Product })[]>;
  createAiOrderSuggestion(suggestion: InsertAiOrderSuggestion): Promise<AiOrderSuggestion>;
  
  // Store Visits
  getStoreVisits(): Promise<(StoreVisit & { hardwareStore: HardwareStore; salesRep: SalesRep })[]>;
  createStoreVisit(visit: InsertStoreVisit): Promise<StoreVisit>;
  
  // Factory Setups
  getFactorySetups(): Promise<FactorySetup[]>;
  getFactorySetup(id: string): Promise<FactorySetup | undefined>;
  createFactorySetup(factory: InsertFactorySetup): Promise<FactorySetup>;
  updateFactorySetup(id: string, factory: Partial<InsertFactorySetup>): Promise<FactorySetup>;
  
  // AI Insights
  getAiInsights(factoryId?: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;

  // Bulk Import Sessions
  getImportSessions(): Promise<BulkImportSession[]>;
  getImportSession(id: string): Promise<BulkImportSession | undefined>;
  createImportSession(session: InsertBulkImportSession): Promise<BulkImportSession>;
  updateImportSession(id: string, updates: Partial<InsertBulkImportSession>): Promise<BulkImportSession>;
  addFileToImportSession(sessionId: string, file: any): Promise<void>;
  updateFileInImportSession(sessionId: string, fileId: string, updates: any): Promise<void>;
  processHardwareStoreRow(row: any, filename: string): Promise<any>;
  
  // Production Metrics
  getProductionMetrics(factoryId: string): Promise<ProductionMetrics[]>;
  createProductionMetrics(metrics: InsertProductionMetrics): Promise<ProductionMetrics>;
  
  // Factory Recommendations
  getFactoryRecommendations(factoryId: string): Promise<FactoryRecommendation[]>;
  createFactoryRecommendation(recommendation: InsertFactoryRecommendation): Promise<FactoryRecommendation>;
  
  // Extended Automation
  getAutomationRules(): Promise<AutomationRule[]>;
  getAutomationRule(id: string): Promise<AutomationRule | undefined>;
  createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule>;
  updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule>;
  
  getAutomationEvents(): Promise<AutomationEvent[]>;
  createAutomationEvent(event: InsertAutomationEvent): Promise<AutomationEvent>;
  
  getMaintenanceSchedules(): Promise<MaintenanceSchedule[]>;
  createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule>;
  
  // Purchase Order System
  getPurchaseOrders(): Promise<(PurchaseOrder & { items?: PurchaseOrderItem[] })[]>;
  getPurchaseOrder(id: string): Promise<(PurchaseOrder & { 
    items: (PurchaseOrderItem & { product: Product })[];
    statusHistory: PoStatusHistory[];
    documents: PoDocument[];
  }) | undefined>;
  createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrder(id: string, order: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder>;
  addPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem>;
  updatePurchaseOrderStatus(id: string, status: string, userId?: string, reason?: string, notes?: string): Promise<PurchaseOrder>;
  generatePONumber(): Promise<string>;
  getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]>;
  getPurchaseOrdersByDateRange(startDate: Date, endDate: Date): Promise<PurchaseOrder[]>;
  searchPurchaseOrders(query: string): Promise<PurchaseOrder[]>;
  addStatusHistory(history: InsertPoStatusHistory): Promise<PoStatusHistory>;
  addDocument(document: InsertPoDocument): Promise<PoDocument>;

  // Logistics Integration (SA Partners)
  getLogisticsPartners(): Promise<any[]>;
  getLogisticsBrands(): Promise<any[]>;

  // Bulk Import Sessions
  getBulkImportSessions(): Promise<BulkImportSession[]>;
  getBulkImportSession(sessionId: string): Promise<BulkImportSession | undefined>;
  createBulkImportSession(session: InsertBulkImportSession): Promise<BulkImportSession>;
  updateBulkImportSession(sessionId: string, session: BulkImportSession): Promise<BulkImportSession>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.category), asc(products.sku));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    
    // Create initial inventory record
    await db.insert(inventory).values({
      productId: newProduct.id,
      currentStock: 0,
      reservedStock: 0,
      reorderPoint: 100,
      maxStock: 10000,
    });
    
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db.select().from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(
            ilike(products.name, `%${query}%`),
            ilike(products.sku, `%${query}%`),
            ilike(products.description, `%${query}%`)
          )
        )
      );
  }

  // Inventory
  async getInventory(): Promise<(Inventory & { product: Product })[]> {
    const result = await db.select()
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(eq(products.isActive, true));
    
    return result.map(row => ({
      ...row.inventory,
      product: row.products
    }));
  }

  async getInventoryByProduct(productId: string): Promise<Inventory | undefined> {
    const [inv] = await db.select().from(inventory).where(eq(inventory.productId, productId));
    return inv || undefined;
  }

  async updateInventory(productId: string, inventoryUpdate: Partial<InsertInventory>): Promise<Inventory> {
    const [updated] = await db.update(inventory)
      .set({ ...inventoryUpdate, updatedAt: new Date() })
      .where(eq(inventory.productId, productId))
      .returning();
    return updated;
  }

  // Distributors
  async getDistributors(): Promise<Distributor[]> {
    return await db.select().from(distributors).orderBy(asc(distributors.name));
  }

  async getDistributor(id: string): Promise<Distributor | undefined> {
    const [distributor] = await db.select().from(distributors).where(eq(distributors.id, id));
    return distributor || undefined;
  }

  async createDistributor(distributor: InsertDistributor): Promise<Distributor> {
    const [newDistributor] = await db.insert(distributors).values(distributor).returning();
    return newDistributor;
  }

  async updateDistributor(id: string, distributor: Partial<InsertDistributor>): Promise<Distributor> {
    const [updated] = await db.update(distributors).set(distributor).where(eq(distributors.id, id)).returning();
    return updated;
  }

  async getDistributorsByRegion(region: string): Promise<Distributor[]> {
    return await db.select().from(distributors).where(eq(distributors.region, region));
  }

  // Orders
  async getOrders(): Promise<(Order & { distributor: Distributor })[]> {
    const result = await db.select()
      .from(orders)
      .innerJoin(distributors, eq(orders.distributorId, distributors.id))
      .orderBy(desc(orders.createdAt));
    
    return result.map(row => ({
      ...row.orders,
      distributor: row.distributors
    }));
  }

  async getOrder(id: string): Promise<(Order & { distributor: Distributor; items: (OrderItem & { product: Product })[] }) | undefined> {
    const [order] = await db.select()
      .from(orders)
      .innerJoin(distributors, eq(orders.distributorId, distributors.id))
      .where(eq(orders.id, id));

    if (!order) return undefined;

    const items = await db.select()
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order.orders,
      distributor: order.distributors,
      items: items.map(item => ({
        ...item.order_items,
        product: item.products
      }))
    };
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getOrdersByDistributor(distributorId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.distributorId, distributorId));
  }

  // Production Schedule
  async getProductionSchedule(): Promise<(ProductionSchedule & { product: Product })[]> {
    const result = await db.select()
      .from(productionSchedule)
      .innerJoin(products, eq(productionSchedule.productId, products.id))
      .orderBy(asc(productionSchedule.scheduledDate));
    
    return result.map(row => ({
      ...row.production_schedule,
      product: row.products
    }));
  }

  async createProductionSchedule(schedule: InsertProductionSchedule): Promise<ProductionSchedule> {
    const [newSchedule] = await db.insert(productionSchedule).values(schedule).returning();
    return newSchedule;
  }

  async updateProductionSchedule(id: string, schedule: Partial<InsertProductionSchedule>): Promise<ProductionSchedule> {
    const [updated] = await db.update(productionSchedule).set(schedule).where(eq(productionSchedule.id, id)).returning();
    return updated;
  }

  async getProductionScheduleByDate(startDate: Date, endDate: Date): Promise<(ProductionSchedule & { product: Product })[]> {
    const result = await db.select()
      .from(productionSchedule)
      .innerJoin(products, eq(productionSchedule.productId, products.id))
      .where(
        and(
          gte(productionSchedule.scheduledDate, startDate),
          lte(productionSchedule.scheduledDate, endDate)
        )
      )
      .orderBy(asc(productionSchedule.scheduledDate));
    
    return result.map(row => ({
      ...row.production_schedule,
      product: row.products
    }));
  }

  // Demand Forecast
  async getDemandForecast(productId?: string, region?: string): Promise<(DemandForecast & { product: Product })[]> {
    let query = db.select()
      .from(demandForecast)
      .innerJoin(products, eq(demandForecast.productId, products.id));

    const conditions = [];
    if (productId) conditions.push(eq(demandForecast.productId, productId));
    if (region) conditions.push(eq(demandForecast.region, region));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query.orderBy(desc(demandForecast.forecastDate));
    
    return result.map(row => ({
      ...row.demand_forecast,
      product: row.products
    }));
  }

  async createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast> {
    const [newForecast] = await db.insert(demandForecast).values(forecast).returning();
    return newForecast;
  }

  // Sales Metrics
  async getSalesMetrics(startDate?: Date, endDate?: Date, region?: string): Promise<SalesMetrics[]> {
    let query = db.select().from(salesMetrics);

    const conditions = [];
    if (startDate) conditions.push(gte(salesMetrics.date, startDate));
    if (endDate) conditions.push(lte(salesMetrics.date, endDate));
    if (region) conditions.push(eq(salesMetrics.region, region));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(salesMetrics.date));
  }

  async createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics> {
    const [newMetrics] = await db.insert(salesMetrics).values(metrics).returning();
    return newMetrics;
  }

  async getSalesMetricsByRegion(): Promise<{ region: string; revenue: string; units: number }[]> {
    return await db.select({
      region: salesMetrics.region,
      revenue: sql<string>`sum(${salesMetrics.revenue})`,
      units: sql<number>`sum(${salesMetrics.units})`
    })
    .from(salesMetrics)
    .groupBy(salesMetrics.region);
  }

  async getTopProducts(limit: number = 10): Promise<{ product: Product; revenue: string; units: number }[]> {
    return await db.select({
      product: products,
      revenue: sql<string>`sum(${salesMetrics.revenue})`,
      units: sql<number>`sum(${salesMetrics.units})`
    })
    .from(salesMetrics)
    .innerJoin(products, eq(salesMetrics.productId, products.id))
    .groupBy(products.id)
    .orderBy(desc(sql`sum(${salesMetrics.revenue})`))
    .limit(limit);
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    return await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(asc(brands.name));
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [newBrand] = await db.insert(brands).values(brand).returning();
    return newBrand;
  }

  // Sales Reps
  async getSalesReps(): Promise<SalesRep[]> {
    return await db.select().from(salesReps).where(eq(salesReps.isActive, true)).orderBy(asc(salesReps.firstName));
  }

  async getSalesRep(id: string): Promise<SalesRep | undefined> {
    const [rep] = await db.select().from(salesReps).where(eq(salesReps.id, id));
    return rep || undefined;
  }

  async createSalesRep(rep: InsertSalesRep): Promise<SalesRep> {
    const [newRep] = await db.insert(salesReps).values(rep).returning();
    return newRep;
  }

  // Hardware Stores
  async getHardwareStores(): Promise<HardwareStore[]> {
    return await db.select().from(hardwareStores).where(eq(hardwareStores.isActive, true)).orderBy(asc(hardwareStores.storeName));
  }

  async getHardwareStore(id: string): Promise<HardwareStore | undefined> {
    const [store] = await db.select().from(hardwareStores).where(eq(hardwareStores.id, id));
    return store || undefined;
  }

  async createHardwareStore(store: InsertHardwareStore): Promise<HardwareStore> {
    const [newStore] = await db.insert(hardwareStores).values(store).returning();
    return newStore;
  }

  async getHardwareStoresByProvince(province: string): Promise<HardwareStore[]> {
    return await db.select().from(hardwareStores)
      .where(and(eq(hardwareStores.province, province), eq(hardwareStores.isActive, true)))
      .orderBy(asc(hardwareStores.storeName));
  }

  // Route Plans
  async getRoutePlans(): Promise<(RoutePlan & { salesRep: SalesRep })[]> {
    const result = await db.select()
      .from(routePlans)
      .innerJoin(salesReps, eq(routePlans.salesRepId, salesReps.id))
      .where(eq(routePlans.isActive, true))
      .orderBy(asc(routePlans.routeName));
    
    return result.map(row => ({
      ...row.route_plans,
      salesRep: row.sales_reps
    }));
  }

  async getRoutePlan(id: string): Promise<(RoutePlan & { salesRep: SalesRep; routeStores: (RouteStore & { hardwareStore: HardwareStore })[] }) | undefined> {
    const [route] = await db.select()
      .from(routePlans)
      .innerJoin(salesReps, eq(routePlans.salesRepId, salesReps.id))
      .where(eq(routePlans.id, id));
    
    if (!route) return undefined;

    const stores = await db.select()
      .from(routeStores)
      .innerJoin(hardwareStores, eq(routeStores.hardwareStoreId, hardwareStores.id))
      .where(eq(routeStores.routePlanId, id))
      .orderBy(asc(routeStores.visitOrder));

    return {
      ...route.route_plans,
      salesRep: route.sales_reps,
      routeStores: stores.map(s => ({ ...s.route_stores, hardwareStore: s.hardware_stores }))
    };
  }

  async createRoutePlan(route: InsertRoutePlan): Promise<RoutePlan> {
    const [newRoute] = await db.insert(routePlans).values(route).returning();
    return newRoute;
  }

  // AI Order Suggestions
  async getAiOrderSuggestions(): Promise<(AiOrderSuggestion & { hardwareStore: HardwareStore; product: Product })[]> {
    const result = await db.select()
      .from(aiOrderSuggestions)
      .innerJoin(hardwareStores, eq(aiOrderSuggestions.hardwareStoreId, hardwareStores.id))
      .innerJoin(products, eq(aiOrderSuggestions.productId, products.id))
      .where(eq(aiOrderSuggestions.status, 'pending'))
      .orderBy(desc(aiOrderSuggestions.confidence));
    
    return result.map(row => ({
      ...row.ai_order_suggestions,
      hardwareStore: row.hardware_stores,
      product: row.products
    }));
  }

  async createAiOrderSuggestion(suggestion: InsertAiOrderSuggestion): Promise<AiOrderSuggestion> {
    const [newSuggestion] = await db.insert(aiOrderSuggestions).values(suggestion).returning();
    return newSuggestion;
  }

  // Store Visits
  async getStoreVisits(): Promise<(StoreVisit & { hardwareStore: HardwareStore; salesRep: SalesRep })[]> {
    const result = await db.select()
      .from(storeVisits)
      .innerJoin(hardwareStores, eq(storeVisits.hardwareStoreId, hardwareStores.id))
      .innerJoin(salesReps, eq(storeVisits.salesRepId, salesReps.id))
      .orderBy(desc(storeVisits.visitDate));
    
    return result.map(row => ({
      ...row.store_visits,
      hardwareStore: row.hardware_stores,
      salesRep: row.sales_reps
    }));
  }

  async createStoreVisit(visit: InsertStoreVisit): Promise<StoreVisit> {
    const [newVisit] = await db.insert(storeVisits).values(visit).returning();
    return newVisit;
  }

  // Factory Setups
  async getFactorySetups(): Promise<FactorySetup[]> {
    return await db.select().from(factorySetups).where(eq(factorySetups.isActive, true)).orderBy(desc(factorySetups.createdAt));
  }

  async getFactorySetup(id: string): Promise<FactorySetup | undefined> {
    const [factory] = await db.select().from(factorySetups).where(eq(factorySetups.id, id));
    return factory || undefined;
  }

  async createFactorySetup(factory: InsertFactorySetup): Promise<FactorySetup> {
    const [newFactory] = await db.insert(factorySetups).values(factory).returning();
    return newFactory;
  }

  async updateFactorySetup(id: string, factory: Partial<InsertFactorySetup>): Promise<FactorySetup> {
    const [updatedFactory] = await db.update(factorySetups)
      .set({ ...factory, updatedAt: new Date() })
      .where(eq(factorySetups.id, id))
      .returning();
    return updatedFactory;
  }

  // AI Insights
  async getAiInsights(factoryId?: string): Promise<AiInsight[]> {
    let query = db.select().from(aiInsights);
    if (factoryId) {
      query = query.where(eq(aiInsights.factoryId, factoryId));
    }
    return await query.orderBy(desc(aiInsights.createdAt));
  }

  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const [newInsight] = await db.insert(aiInsights).values(insight).returning();
    return newInsight;
  }

  // Production Metrics
  async getProductionMetrics(factoryId: string): Promise<ProductionMetrics[]> {
    return await db.select().from(productionMetrics)
      .where(eq(productionMetrics.factoryId, factoryId))
      .orderBy(desc(productionMetrics.metricDate));
  }

  async createProductionMetrics(metrics: InsertProductionMetrics): Promise<ProductionMetrics> {
    const [newMetrics] = await db.insert(productionMetrics).values(metrics).returning();
    return newMetrics;
  }

  // Factory Recommendations
  async getFactoryRecommendations(factoryId: string): Promise<FactoryRecommendation[]> {
    return await db.select().from(factoryRecommendations)
      .where(eq(factoryRecommendations.factoryId, factoryId))
      .orderBy(desc(factoryRecommendations.createdAt));
  }

  async createFactoryRecommendation(recommendation: InsertFactoryRecommendation): Promise<FactoryRecommendation> {
    const [newRecommendation] = await db.insert(factoryRecommendations).values(recommendation).returning();
    return newRecommendation;
  }

  // Extended Automation
  async getAutomationRules(): Promise<AutomationRule[]> {
    return await db.select().from(automationRules)
      .orderBy(desc(automationRules.priority), desc(automationRules.createdAt));
  }

  async getAutomationRule(id: string): Promise<AutomationRule | undefined> {
    const [rule] = await db.select().from(automationRules).where(eq(automationRules.id, id));
    return rule || undefined;
  }

  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> {
    const [newRule] = await db.insert(automationRules).values(rule).returning();
    return newRule;
  }

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const [updated] = await db.update(automationRules)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(automationRules.id, id))
      .returning();
    return updated;
  }

  async getAutomationEvents(): Promise<AutomationEvent[]> {
    return await db.select().from(automationEvents)
      .orderBy(desc(automationEvents.createdAt));
  }

  async createAutomationEvent(event: InsertAutomationEvent): Promise<AutomationEvent> {
    const [newEvent] = await db.insert(automationEvents).values(event).returning();
    return newEvent;
  }

  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> {
    return await db.select().from(maintenanceSchedules)
      .orderBy(asc(maintenanceSchedules.scheduledDate));
  }

  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> {
    const [newSchedule] = await db.insert(maintenanceSchedules).values(schedule).returning();
    return newSchedule;
  }

  // Excel Upload - Synchronized with Hardware Store Directory
  async getExcelUploads(): Promise<any[]> {
    return await db.select().from(excelUploads)
      .orderBy(desc(excelUploads.uploadedAt));
  }

  async createExcelUpload(upload: any): Promise<any> {
    const [newUpload] = await db.insert(excelUploads).values(upload).returning();
    return newUpload;
  }

  async updateExcelUpload(id: string, updates: any): Promise<any> {
    const [updated] = await db.update(excelUploads)
      .set(updates)
      .where(eq(excelUploads.id, id))
      .returning();
    return updated;
  }

  async createHardwareStoreFromExcel(store: any): Promise<any> {
    const [newStore] = await db.insert(hardwareStoresFromExcel).values(store).returning();
    
    // Sync with main hardware stores table for 24/7 balance
    await this.syncStoreToMainDirectory(newStore);
    
    return newStore;
  }

  async createSalesRepRouteFromExcel(route: any): Promise<any> {
    const [newRoute] = await db.insert(salesRepRoutesFromExcel).values(route).returning();
    
    // Sync with main routes table for 24/7 balance
    await this.syncRouteToMainDirectory(newRoute);
    
    return newRoute;
  }

  async getHardwareStoresFromExcel(): Promise<any[]> {
    return await db.select().from(hardwareStoresFromExcel)
      .orderBy(desc(hardwareStoresFromExcel.createdAt));
  }

  async getSalesRepRoutesFromExcel(): Promise<any[]> {
    return await db.select().from(salesRepRoutesFromExcel)
      .orderBy(desc(salesRepRoutesFromExcel.createdAt));
  }

  // Public sync methods for API access
  async syncStoreToMainDirectory(excelStore: any): Promise<void> {
    try {
      // Check if store already exists in main directory
      const existingStore = await db.select()
        .from(hardwareStores)
        .where(eq(hardwareStores.storeName, excelStore.storeName))
        .limit(1);

      if (existingStore.length === 0) {
        // Create new store in main directory
        await db.insert(hardwareStores).values({
          name: excelStore.storeName,
          address: excelStore.storeAddress,
          city: excelStore.cityTown,
          province: excelStore.province,
          contactPerson: excelStore.contactPerson,
          phoneNumber: excelStore.phoneNumber,
          size: 'medium', // Default value
          creditRating: 'good', // Default value
          region: excelStore.province,
          gpsCoordinates: '', // Will be filled later
          lastVisitDate: null,
          preferredVisitDay: 'monday',
          notes: `Imported from Excel: ${excelStore.mappedToCornex}`
        });
      }
    } catch (error) {
      console.error('Error syncing store to main directory:', error);
    }
  }

  async syncRouteToMainDirectory(excelRoute: any): Promise<void> {
    try {
      // Check if rep exists
      let rep = await db.select()
        .from(salesReps)
        .where(eq(salesReps.name, excelRoute.repName))
        .limit(1);

      if (rep.length === 0) {
        // Create new sales rep
        const [newRep] = await db.insert(salesReps).values({
          name: excelRoute.repName,
          email: `${excelRoute.repName.toLowerCase().replace(' ', '.')}@cornex.co.za`,
          phone: '',
          region: 'South Africa',
          territory: excelRoute.routeName || 'General',
          performanceRating: 85, // Default value
          targetSales: 50000, // Default value
          notes: `Imported from Excel: ${excelRoute.mappedToCornex}`
        }).returning();
        rep = [newRep];
      }

      // Create route plan if it doesn't exist
      const existingRoute = await db.select()
        .from(routePlans)
        .where(eq(routePlans.name, excelRoute.routeName || `${excelRoute.repName} Route`))
        .limit(1);

      if (existingRoute.length === 0) {
        await db.insert(routePlans).values({
          name: excelRoute.routeName || `${excelRoute.repName} Route`,
          salesRepId: rep[0].id,
          description: `Auto-generated from Excel upload: ${excelRoute.mappedToCornex}`,
          frequency: excelRoute.visitFrequency || 'weekly',
          estimatedDuration: 480, // 8 hours default
          optimizationScore: 75, // Default value
          totalDistance: 0, // Will be calculated later
          isActive: true
        });
      }
    } catch (error) {
      console.error('Error syncing route to main directory:', error);
    }
  }
  
  // Purchase Order System Implementation
  async getPurchaseOrders(): Promise<(PurchaseOrder & { items?: PurchaseOrderItem[] })[]> {
    const orders = await db.select().from(purchaseOrders).orderBy(desc(purchaseOrders.createdAt));
    
    // Get items count for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const items = await db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, order.id));
      return { ...order, items };
    }));
    
    return ordersWithItems;
  }

  async getPurchaseOrder(id: string): Promise<(PurchaseOrder & { 
    items: (PurchaseOrderItem & { product: Product })[];
    statusHistory: PoStatusHistory[];
    documents: PoDocument[];
  }) | undefined> {
    const [order] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    if (!order) return undefined;

    // Get items with product details
    const items = await db
      .select({
        id: purchaseOrderItems.id,
        purchaseOrderId: purchaseOrderItems.purchaseOrderId,
        productId: purchaseOrderItems.productId,
        quantity: purchaseOrderItems.quantity,
        unitPrice: purchaseOrderItems.unitPrice,
        lineTotal: purchaseOrderItems.lineTotal,
        estimatedProductionTime: purchaseOrderItems.estimatedProductionTime,
        actualProductionTime: purchaseOrderItems.actualProductionTime,
        productionStatus: purchaseOrderItems.productionStatus,
        customSpecifications: purchaseOrderItems.customSpecifications,
        packagingNotes: purchaseOrderItems.packagingNotes,
        createdAt: purchaseOrderItems.createdAt,
        product: products
      })
      .from(purchaseOrderItems)
      .leftJoin(products, eq(purchaseOrderItems.productId, products.id))
      .where(eq(purchaseOrderItems.purchaseOrderId, id));

    // Get status history
    const statusHistory = await db
      .select()
      .from(poStatusHistory)
      .where(eq(poStatusHistory.purchaseOrderId, id))
      .orderBy(desc(poStatusHistory.timestamp));

    // Get documents
    const documents = await db
      .select()
      .from(poDocuments)
      .where(eq(poDocuments.purchaseOrderId, id))
      .orderBy(desc(poDocuments.uploadedAt));

    return {
      ...order,
      items: items.map(item => ({ 
        ...item,
        product: item.product!
      })),
      statusHistory,
      documents
    };
  }

  async createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder> {
    // Generate PO number if not provided
    const poNumber = order.poNumber || await this.generatePONumber();

    const [newOrder] = await db.insert(purchaseOrders).values({
      ...order,
      poNumber
    }).returning();
    
    // Add initial status history
    await this.addStatusHistory({
      purchaseOrderId: newOrder.id,
      newStatus: 'pending',
      changeReason: 'Purchase order created',
      notes: 'Initial creation of purchase order'
    });

    return newOrder;
  }

  async updatePurchaseOrder(id: string, order: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder> {
    const [updatedOrder] = await db
      .update(purchaseOrders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(purchaseOrders.id, id))
      .returning();
    
    return updatedOrder;
  }

  async addPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> {
    const [newItem] = await db.insert(purchaseOrderItems).values(item).returning();
    
    // Update order totals
    await this.recalculateOrderTotals(item.purchaseOrderId);
    
    return newItem;
  }

  async updatePurchaseOrderStatus(id: string, status: string, userId?: string, reason?: string, notes?: string): Promise<PurchaseOrder> {
    // Get current status
    const [currentOrder] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    if (!currentOrder) throw new Error('Purchase order not found');

    // Update status
    const updates: any = { status, updatedAt: new Date() };
    if (status === 'approved' && userId) {
      updates.approvedBy = userId;
      updates.approvedAt = new Date();
    }

    const [updatedOrder] = await db
      .update(purchaseOrders)
      .set(updates)
      .where(eq(purchaseOrders.id, id))
      .returning();

    // Add status history
    await this.addStatusHistory({
      purchaseOrderId: id,
      previousStatus: currentOrder.status,
      newStatus: status,
      changedBy: userId,
      changeReason: reason || `Status changed to ${status}`,
      notes
    });

    return updatedOrder;
  }

  async generatePONumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    
    // Get the last PO number for this month
    const lastPO = await db
      .select()
      .from(purchaseOrders)
      .where(sql`po_number LIKE ${`PO-${year}${month}%`}`)
      .orderBy(desc(purchaseOrders.poNumber))
      .limit(1);

    let nextSequence = 1;
    if (lastPO.length > 0) {
      const lastSequence = parseInt(lastPO[0].poNumber.split('-')[2]) || 0;
      nextSequence = lastSequence + 1;
    }

    return `PO-${year}${month}-${nextSequence.toString().padStart(4, '0')}`;
  }

  async getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]> {
    return await db.select().from(purchaseOrders).where(eq(purchaseOrders.status, status)).orderBy(desc(purchaseOrders.createdAt));
  }

  async getPurchaseOrdersByDateRange(startDate: Date, endDate: Date): Promise<PurchaseOrder[]> {
    return await db
      .select()
      .from(purchaseOrders)
      .where(and(
        gte(purchaseOrders.orderDate, startDate),
        lte(purchaseOrders.orderDate, endDate)
      ))
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async searchPurchaseOrders(query: string): Promise<PurchaseOrder[]> {
    return await db
      .select()
      .from(purchaseOrders)
      .where(or(
        ilike(purchaseOrders.poNumber, `%${query}%`),
        ilike(purchaseOrders.customerName, `%${query}%`),
        ilike(purchaseOrders.customerEmail, `%${query}%`)
      ))
      .orderBy(desc(purchaseOrders.createdAt));
  }

  async addStatusHistory(history: InsertPoStatusHistory): Promise<PoStatusHistory> {
    const [newHistory] = await db.insert(poStatusHistory).values(history).returning();
    return newHistory;
  }

  async addDocument(document: InsertPoDocument): Promise<PoDocument> {
    const [newDocument] = await db.insert(poDocuments).values(document).returning();
    return newDocument;
  }

  // Helper method to recalculate order totals
  private async recalculateOrderTotals(orderId: string): Promise<void> {
    const items = await db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, orderId));
    
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.lineTotal.toString()), 0);
    const taxAmount = subtotal * 0.15; // 15% VAT
    const total = subtotal + taxAmount;

    await db
      .update(purchaseOrders)
      .set({
        subtotal: subtotal.toString(),
        taxAmount: taxAmount.toString(),
        totalAmount: total.toString(),
        updatedAt: new Date()
      })
      .where(eq(purchaseOrders.id, orderId));
  }
  // Logistics Integration - South African Partners
  async getLogisticsPartners(): Promise<any[]> {
    // Return strategic South African logistics partners
    return [
      {
        id: "unitrans-africa",
        name: "Unitrans Africa",
        type: "freight",
        logo: "🚛",
        coverage: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Free State", "Eastern Cape"],
        services: ["Heavy Freight", "Supply Chain", "Warehousing", "Cross-border"],
        pricing: { base: 150, perKm: 12.50, currency: "ZAR" },
        reliability: 94,
        integration: "active",
        contactInfo: {
          phone: "+27 11 451 1700",
          email: "info@unitransafrica.com",
          website: "https://unitransafrica.com"
        }
      },
      {
        id: "imperial-logistics",
        name: "Imperial Logistics (DP World)",
        type: "freight",
        logo: "🌍",
        coverage: ["National Coverage", "SADC Region", "Global Network"],
        services: ["End-to-end Logistics", "Distribution", "Supply Chain Solutions"],
        pricing: { base: 200, perKm: 15.75, currency: "ZAR" },
        reliability: 96,
        integration: "testing",
        contactInfo: {
          phone: "+27 11 739 4000",
          email: "logistics@imperial.co.za",
          website: "https://imperiallogistics.com"
        }
      },
      {
        id: "postnet-aramex",
        name: "PostNet (Aramex Network)",
        type: "courier",
        logo: "📮",
        coverage: ["496 Locations", "National Network", "50km Radius Major Centers"],
        services: ["Same-day Delivery", "PostNet2PostNet", "International Express"],
        pricing: { base: 89.99, perKm: 2.50, currency: "ZAR" },
        reliability: 91,
        integration: "active",
        contactInfo: {
          phone: "0860 767 8638",
          email: "support@postnet.co.za",
          website: "https://postnet.co.za"
        }
      },
      {
        id: "shaft-packaging",
        name: "Shaft Packaging",
        type: "packaging",
        logo: "📦",
        coverage: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
        services: ["Packaging Solutions", "Custom Design", "Nationwide Delivery"],
        pricing: { base: 75, perKm: 1.25, currency: "ZAR" },
        reliability: 89,
        integration: "planned",
        contactInfo: {
          phone: "+27 11 608 1221",
          email: "info@shaftpackaging.co.za",
          website: "https://shaftpackaging.co.za"
        }
      },
      {
        id: "polyoak-packaging",
        name: "Polyoak Packaging",
        type: "packaging",
        logo: "🏭",
        coverage: ["40+ Manufacturing Plants", "Southern Africa", "Multi-location"],
        services: ["Rigid Plastic Packaging", "Food & Beverage", "Industrial"],
        pricing: { base: 125, perKm: 3.75, currency: "ZAR" },
        reliability: 93,
        integration: "testing",
        contactInfo: {
          phone: "+27 21 951 8000",
          email: "info@polyoakpackaging.co.za",
          website: "https://polyoakpackaging.co.za"
        }
      }
    ];
  }

  async getLogisticsBrands(): Promise<any[]> {
    // Return CornexConnect logistics brands integrated with SA partners
    return [
      {
        id: "routemesh-sa",
        name: "RouteMesh™ SA",
        purpose: "Route Optimization for Hardware Store Distribution",
        icon: "🗺️",
        partners: ["unitrans-africa", "imperial-logistics"],
        status: "operational",
        capabilities: [
          "8500+ Hardware Store Network",
          "AI-Powered Route Planning",
          "Real-time Traffic Integration",
          "Multi-stop Optimization"
        ],
        metrics: {
          volume: "12,500 deliveries/month",
          efficiency: 87,
          coverage: "9 Provinces"
        }
      },
      {
        id: "cratelogic-connect",
        name: "CrateLogic™ Connect",
        purpose: "Smart Container Management for EPS/BR XPS Products",
        icon: "📦",
        partners: ["shaft-packaging", "polyoak-packaging"],
        status: "development",
        capabilities: [
          "Temperature-Controlled Containers",
          "IoT Tracking Integration",
          "Custom Packaging Design",
          "Inventory Auto-reorder"
        ],
        metrics: {
          volume: "31 SKUs managed",
          efficiency: 92,
          coverage: "Major Distribution Centers"
        }
      },
      {
        id: "deliveryx-network",
        name: "DeliveryX™ Network",
        purpose: "Last-Mile Delivery for Construction Materials",
        icon: "🚀",
        partners: ["postnet-aramex"],
        status: "development",
        capabilities: [
          "Same-day Construction Delivery",
          "Heavy Materials Handling",
          "Site-specific Delivery",
          "Installation Scheduling"
        ],
        metrics: {
          volume: "2,800 deliveries/month",
          efficiency: 78,
          coverage: "Metropolitan Areas"
        }
      },
      {
        id: "labelflow-pro",
        name: "LabelFlow™ Pro",
        purpose: "Automated Product Labeling & Compliance",
        icon: "🏷️",
        partners: ["shaft-packaging"],
        status: "planning",
        capabilities: [
          "Automated Label Generation",
          "SABS Compliance Tracking",
          "Multi-language Support",
          "QR Code Integration"
        ],
        metrics: {
          volume: "50,000 labels/day",
          efficiency: 95,
          coverage: "All Product Lines"
        }
      }
    ];
  }
}

// Temporarily use in-memory storage while database connection is being restored
class MemoryStorage implements IStorage {
  // Logistics Integration - South African Partners
  async getLogisticsPartners(): Promise<any[]> {
    // Return strategic South African logistics partners
    return [
      {
        id: "unitrans-africa",
        name: "Unitrans Africa",
        type: "freight",
        logo: "🚛",
        coverage: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Free State", "Eastern Cape"],
        services: ["Heavy Freight", "Supply Chain", "Warehousing", "Cross-border"],
        pricing: { base: 150, perKm: 12.50, currency: "ZAR" },
        reliability: 94,
        integration: "active",
        contactInfo: {
          phone: "+27 11 451 1700",
          email: "info@unitransafrica.com",
          website: "https://unitransafrica.com"
        }
      },
      {
        id: "imperial-logistics",
        name: "Imperial Logistics (DP World)",
        type: "freight",
        logo: "🌍",
        coverage: ["National Coverage", "SADC Region", "Global Network"],
        services: ["End-to-end Logistics", "Distribution", "Supply Chain Solutions"],
        pricing: { base: 200, perKm: 15.75, currency: "ZAR" },
        reliability: 96,
        integration: "testing",
        contactInfo: {
          phone: "+27 11 739 4000",
          email: "logistics@imperial.co.za",
          website: "https://imperiallogistics.com"
        }
      },
      {
        id: "postnet-aramex",
        name: "PostNet (Aramex Network)",
        type: "courier",
        logo: "📮",
        coverage: ["496 Locations", "National Network", "50km Radius Major Centers"],
        services: ["Same-day Delivery", "PostNet2PostNet", "International Express"],
        pricing: { base: 89.99, perKm: 2.50, currency: "ZAR" },
        reliability: 91,
        integration: "active",
        contactInfo: {
          phone: "0860 767 8638",
          email: "support@postnet.co.za",
          website: "https://postnet.co.za"
        }
      },
      {
        id: "shaft-packaging",
        name: "Shaft Packaging",
        type: "packaging",
        logo: "📦",
        coverage: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
        services: ["Packaging Solutions", "Custom Design", "Nationwide Delivery"],
        pricing: { base: 75, perKm: 1.25, currency: "ZAR" },
        reliability: 89,
        integration: "planned",
        contactInfo: {
          phone: "+27 11 608 1221",
          email: "info@shaftpackaging.co.za",
          website: "https://shaftpackaging.co.za"
        }
      },
      {
        id: "polyoak-packaging",
        name: "Polyoak Packaging",
        type: "packaging",
        logo: "🏭",
        coverage: ["40+ Manufacturing Plants", "Southern Africa", "Multi-location"],
        services: ["Rigid Plastic Packaging", "Food & Beverage", "Industrial"],
        pricing: { base: 125, perKm: 3.75, currency: "ZAR" },
        reliability: 93,
        integration: "testing",
        contactInfo: {
          phone: "+27 21 951 8000",
          email: "info@polyoakpackaging.co.za",
          website: "https://polyoakpackaging.co.za"
        }
      }
    ];
  }

  async getLogisticsBrands(): Promise<any[]> {
    // Return CornexConnect logistics brands integrated with SA partners
    return [
      {
        id: "routemesh-sa",
        name: "RouteMesh™ SA",
        purpose: "Route Optimization for Hardware Store Distribution",
        icon: "🗺️",
        partners: ["unitrans-africa", "imperial-logistics"],
        status: "operational",
        capabilities: [
          "8500+ Hardware Store Network",
          "AI-Powered Route Planning",
          "Real-time Traffic Integration",
          "Multi-stop Optimization"
        ],
        metrics: {
          volume: "12,500 deliveries/month",
          efficiency: 87,
          coverage: "9 Provinces"
        }
      },
      {
        id: "cratelogic-connect",
        name: "CrateLogic™ Connect",
        purpose: "Smart Container Management for EPS/BR XPS Products",
        icon: "📦",
        partners: ["shaft-packaging", "polyoak-packaging"],
        status: "development",
        capabilities: [
          "Temperature-Controlled Containers",
          "IoT Tracking Integration",
          "Custom Packaging Design",
          "Inventory Auto-reorder"
        ],
        metrics: {
          volume: "31 SKUs managed",
          efficiency: 92,
          coverage: "Major Distribution Centers"
        }
      },
      {
        id: "deliveryx-network",
        name: "DeliveryX™ Network",
        purpose: "Last-Mile Delivery for Construction Materials",
        icon: "🚀",
        partners: ["postnet-aramex"],
        status: "development",
        capabilities: [
          "Same-day Construction Delivery",
          "Heavy Materials Handling",
          "Site-specific Delivery",
          "Installation Scheduling"
        ],
        metrics: {
          volume: "2,800 deliveries/month",
          efficiency: 78,
          coverage: "Metropolitan Areas"
        }
      },
      {
        id: "labelflow-pro",
        name: "LabelFlow™ Pro",
        purpose: "Automated Product Labeling & Compliance",
        icon: "🏷️",
        partners: ["shaft-packaging"],
        status: "planning",
        capabilities: [
          "Automated Label Generation",
          "SABS Compliance Tracking",
          "Multi-language Support",
          "QR Code Integration"
        ],
        metrics: {
          volume: "50,000 labels/day",
          efficiency: 95,
          coverage: "All Product Lines"
        }
      }
    ];
  }

  // Product Labeling System - In-memory arrays
  private productLabels: ProductLabel[] = [];
  private printers: Printer[] = [
    {
      id: "demo_printer_1",
      name: "Main Office Printer",
      model: "HP LaserJet Pro M404dn",
      manufacturer: "HP",
      ipAddress: "192.168.1.100",
      location: "Main Office",
      department: "Administration",
      printerType: "laser",
      connectionType: "wifi",
      status: "online",
      isDefault: true,
      paperLevel: 85,
      supportedSizes: ["A4", "A5", "4x6"],
      capabilities: {
        color: false,
        duplex: true,
        staple: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "demo_printer_2", 
      name: "Warehouse Color Printer",
      model: "Canon PIXMA G7020",
      manufacturer: "Canon",
      ipAddress: "192.168.1.101",
      location: "Warehouse",
      department: "Production",
      printerType: "inkjet",
      connectionType: "wifi",
      status: "online",
      isDefault: false,
      paperLevel: 72,
      supportedSizes: ["A4", "A5"],
      capabilities: {
        color: true,
        duplex: true,
        staple: false
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  private printJobs: PrintJob[] = [];
  private labelTemplates: LabelTemplate[] = [];

  // Stub implementations for all required methods  
  async getUser(id: string): Promise<User | undefined> { 
    return this.users.find(u => u.id === id);
  }
  async upsertUser(user: UpsertUser): Promise<User> { 
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    const newUser: User = {
      id: user.id || `user_${Date.now()}`,
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role || 'viewer',
      region: user.region || null,
      currency: user.currency || null,
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...newUser };
      return this.users[existingIndex];
    } else {
      this.users.push(newUser);
      return newUser;
    }
  }
  async getUserByUsername(username: string): Promise<User | undefined> { return undefined; }
  async createUser(user: InsertUser): Promise<User> { throw new Error("Database temporarily unavailable"); }

  // Product Labeling System Methods
  async getProductLabels(): Promise<ProductLabel[]> {
    return [...this.productLabels].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProductLabel(id: string): Promise<ProductLabel | undefined> {
    return this.productLabels.find(label => label.id === id);
  }

  async createProductLabel(labelData: InsertProductLabel): Promise<ProductLabel> {
    const newLabel: ProductLabel = {
      id: `label_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...labelData,
      version: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.productLabels.push(newLabel);
    return newLabel;
  }

  async updateProductLabel(id: string, labelData: Partial<InsertProductLabel>): Promise<ProductLabel> {
    const index = this.productLabels.findIndex(label => label.id === id);
    if (index === -1) throw new Error("Product label not found");
    
    this.productLabels[index] = {
      ...this.productLabels[index],
      ...labelData,
      updatedAt: new Date(),
    };
    return this.productLabels[index];
  }

  async deleteProductLabel(id: string): Promise<boolean> {
    const index = this.productLabels.findIndex(label => label.id === id);
    if (index === -1) return false;
    this.productLabels.splice(index, 1);
    return true;
  }

  // Printer Methods
  async getPrinters(): Promise<Printer[]> {
    return [...this.printers].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getPrinter(id: string): Promise<Printer | undefined> {
    return this.printers.find(printer => printer.id === id);
  }

  async createPrinter(printerData: InsertPrinter): Promise<Printer> {
    const newPrinter: Printer = {
      id: `printer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...printerData,
      status: "offline",
      isDefault: false,
      paperLevel: 100,
      supportedSizes: printerData.supportedSizes || ["A4"],
      capabilities: printerData.capabilities || { color: true, duplex: true, staple: false },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.printers.push(newPrinter);
    return newPrinter;
  }

  async updatePrinter(id: string, printerData: Partial<InsertPrinter>): Promise<Printer> {
    const index = this.printers.findIndex(printer => printer.id === id);
    if (index === -1) throw new Error("Printer not found");
    
    this.printers[index] = {
      ...this.printers[index],
      ...printerData,
      updatedAt: new Date(),
    };
    return this.printers[index];
  }

  async deletePrinter(id: string): Promise<boolean> {
    const index = this.printers.findIndex(printer => printer.id === id);
    if (index === -1) return false;
    this.printers.splice(index, 1);
    return true;
  }

  // Print Job Methods
  async getPrintJobs(): Promise<PrintJob[]> {
    return [...this.printJobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPrintJob(id: string): Promise<PrintJob | undefined> {
    return this.printJobs.find(job => job.id === id);
  }

  async getPrintJobsByPrinter(printerId: string): Promise<PrintJob[]> {
    return this.printJobs.filter(job => job.printerId === printerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPrintJobsByUser(userId: string): Promise<PrintJob[]> {
    return this.printJobs.filter(job => job.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPrintJob(jobData: InsertPrintJob): Promise<PrintJob> {
    const newJob: PrintJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...jobData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.printJobs.push(newJob);
    return newJob;
  }

  async updatePrintJobStatus(id: string, status: string): Promise<PrintJob> {
    const index = this.printJobs.findIndex(job => job.id === id);
    if (index === -1) throw new Error("Print job not found");
    
    this.printJobs[index] = {
      ...this.printJobs[index],
      status,
      updatedAt: new Date(),
    };
    return this.printJobs[index];
  }

  // Label Template Methods
  async getLabelTemplates(): Promise<LabelTemplate[]> {
    return [...this.labelTemplates].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getLabelTemplate(id: string): Promise<LabelTemplate | undefined> {
    return this.labelTemplates.find(template => template.id === id);
  }

  async createLabelTemplate(templateData: InsertLabelTemplate): Promise<LabelTemplate> {
    const newTemplate: LabelTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...templateData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.labelTemplates.push(newTemplate);
    return newTemplate;
  }
  
  // In-memory storage arrays
  private users: User[] = [];
  private products: Product[] = [];
  private brands: Brand[] = [];
  private distributors: Distributor[] = [];
  private hardwareStores: HardwareStore[] = [];
  private bulkImportSessions: BulkImportSession[] = [];

  // User Management Methods (Memory implementation)
  async getAllUsers(): Promise<User[]> {
    return this.users.filter(u => u.isActive);
  }
  
  async createHardwareStore(store: InsertHardwareStore): Promise<HardwareStore> {
    const newStore: HardwareStore = {
      id: `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: store.email || null,
      isActive: store.isActive !== undefined ? store.isActive : true,
      createdAt: new Date(),
      contactPerson: store.contactPerson || null,
      phone: store.phone || null,
      address: store.address,
      city: store.city,
      province: store.province,
      postalCode: store.postalCode || null,
      gpsCoordinates: store.gpsCoordinates || null,
      storeSize: store.storeSize || null,
      creditLimit: store.creditLimit || null,
      paymentTerms: store.paymentTerms || null,
      salesRepId: store.salesRepId || null,
      visitFrequency: store.visitFrequency || null,
      lastOrderDate: store.lastOrderDate || null,
      totalOrders: store.totalOrders || 0,
      avgOrderValue: store.avgOrderValue || null,
      lastVisitDate: store.lastVisitDate || null
    };
    this.hardwareStores.push(newStore);
    console.log(`[Storage] Added hardware store: ${newStore.address}, ${newStore.city}. Total stores: ${this.hardwareStores.length}`);
    return newStore;
  }
  async getProducts(): Promise<Product[]> { 
    return this.products.filter(p => p.isActive);
  }

  async getProduct(id: string): Promise<Product | undefined> { 
    return this.products.find(p => p.id === id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> { 
    return this.products.find(p => p.sku === sku);
  }

  async createProduct(product: InsertProduct): Promise<Product> { 
    const newProduct: Product = {
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...product,
      isActive: product.isActive !== undefined ? product.isActive : true,
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    console.log(`[Storage] Created product: ${newProduct.sku} - ${newProduct.name}. Total products: ${this.products.length}`);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> { 
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<void> { 
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index].isActive = false;
    }
  }

  async searchProducts(query: string): Promise<Product[]> { 
    const lowQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowQuery) ||
        p.sku.toLowerCase().includes(lowQuery) ||
        (p.description && p.description.toLowerCase().includes(lowQuery))
      )
    );
  }
  async getInventory(): Promise<(Inventory & { product: Product })[]> { return []; }
  async getInventoryByProduct(productId: string): Promise<Inventory | undefined> { return undefined; }
  async updateInventory(productId: string, inventory: Partial<InsertInventory>): Promise<Inventory> { throw new Error("Database temporarily unavailable"); }
  async getDistributors(): Promise<Distributor[]> { 
    return this.distributors.filter(d => d.isActive);
  }
  async getDistributor(id: string): Promise<Distributor | undefined> { return undefined; }
  async createDistributor(distributor: InsertDistributor): Promise<Distributor> {
    const newDistributor: Distributor = {
      id: `distributor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...distributor,
      status: distributor.status || 'active',
      tier: distributor.tier || 'premium',
      creditLimit: distributor.creditLimit || "100000.00",
      currentBalance: distributor.currentBalance || "0.00",
      lastOrderDate: distributor.lastOrderDate || null,
      totalOrders: distributor.totalOrders || 0,
      avgOrderValue: distributor.avgOrderValue || null,
      isActive: distributor.isActive !== undefined ? distributor.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.distributors.push(newDistributor);
    console.log(`[Storage] Created distributor: ${newDistributor.name}. Total distributors: ${this.distributors.length}`);
    return newDistributor;
  }
  async updateDistributor(id: string, distributor: Partial<InsertDistributor>): Promise<Distributor> { throw new Error("Database temporarily unavailable"); }
  async getDistributorsByRegion(region: string): Promise<Distributor[]> { return []; }
  async getOrders(): Promise<(Order & { distributor: Distributor })[]> { return []; }
  async getOrder(id: string): Promise<(Order & { distributor: Distributor; items: (OrderItem & { product: Product })[] }) | undefined> { return undefined; }
  async createOrder(order: InsertOrder): Promise<Order> { throw new Error("Database temporarily unavailable"); }
  async updateOrderStatus(id: string, status: string): Promise<Order> { throw new Error("Database temporarily unavailable"); }
  async getOrdersByDistributor(distributorId: string): Promise<Order[]> { return []; }
  async getProductionSchedule(): Promise<(ProductionSchedule & { product: Product })[]> { return []; }
  async createProductionSchedule(schedule: InsertProductionSchedule): Promise<ProductionSchedule> { throw new Error("Database temporarily unavailable"); }
  async updateProductionSchedule(id: string, schedule: Partial<InsertProductionSchedule>): Promise<ProductionSchedule> { throw new Error("Database temporarily unavailable"); }
  async getProductionScheduleByDate(startDate: Date, endDate: Date): Promise<(ProductionSchedule & { product: Product })[]> { return []; }
  async getDemandForecast(productId?: string, region?: string): Promise<(DemandForecast & { product: Product })[]> { return []; }
  async createDemandForecast(forecast: InsertDemandForecast): Promise<DemandForecast> { throw new Error("Database temporarily unavailable"); }
  async getSalesMetrics(startDate?: Date, endDate?: Date, region?: string): Promise<SalesMetrics[]> { return []; }
  async createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics> { throw new Error("Database temporarily unavailable"); }
  async getSalesMetricsByRegion(): Promise<{ region: string; revenue: string; units: number }[]> { return []; }
  async getTopProducts(limit?: number): Promise<{ product: Product; revenue: string; units: number }[]> { return []; }
  async getBrands(): Promise<Brand[]> { 
    return this.brands.filter(b => b.isActive);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> { 
    const newBrand: Brand = {
      id: `brand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: brand.name,
      isActive: brand.isActive !== undefined ? brand.isActive : true,
      createdAt: new Date(),
      description: brand.description || null,
      displayName: brand.displayName,
      color: brand.color,
      icon: brand.icon || null
    };
    this.brands.push(newBrand);
    console.log(`[Storage] Created brand: ${newBrand.displayName}. Total brands: ${this.brands.length}`);
    return newBrand;
  }
  async getSalesReps(): Promise<SalesRep[]> { return []; }
  async getSalesRep(id: string): Promise<SalesRep | undefined> { return undefined; }
  async createSalesRep(rep: InsertSalesRep): Promise<SalesRep> { throw new Error("Database temporarily unavailable"); }
  async getHardwareStores(): Promise<HardwareStore[]> { 
    console.log(`[Storage] Retrieved ${this.hardwareStores.length} hardware stores from memory`);
    return this.hardwareStores; 
  }

  // Bulk Import Sessions
  async getBulkImportSessions(): Promise<BulkImportSession[]> {
    return this.bulkImportSessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  }

  async getBulkImportSession(sessionId: string): Promise<BulkImportSession | undefined> {
    return this.bulkImportSessions.find(session => session.id === sessionId);
  }

  async createBulkImportSession(session: InsertBulkImportSession): Promise<BulkImportSession> {
    const newSession: BulkImportSession = {
      ...session,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bulkImportSessions.push(newSession);
    return newSession;
  }

  async updateBulkImportSession(sessionId: string, updates: BulkImportSession): Promise<BulkImportSession> {
    const index = this.bulkImportSessions.findIndex(session => session.id === sessionId);
    if (index !== -1) {
      updates.updatedAt = new Date();
      this.bulkImportSessions[index] = updates;
      return this.bulkImportSessions[index];
    }
    throw new Error(`Session ${sessionId} not found`);
  }
  async getHardwareStore(id: string): Promise<HardwareStore | undefined> { 
    return this.hardwareStores.find(store => store.id === id);
  }
  async getHardwareStoresByProvince(province: string): Promise<HardwareStore[]> { 
    return this.hardwareStores.filter(store => store.province === province);
  }
  async getRoutePlans(): Promise<(RoutePlan & { salesRep: SalesRep })[]> { return []; }
  async getRoutePlan(id: string): Promise<(RoutePlan & { salesRep: SalesRep; routeStores: (RouteStore & { hardwareStore: HardwareStore })[] }) | undefined> { return undefined; }
  async createRoutePlan(route: InsertRoutePlan): Promise<RoutePlan> { throw new Error("Database temporarily unavailable"); }
  async getAiOrderSuggestions(): Promise<(AiOrderSuggestion & { hardwareStore: HardwareStore; product: Product })[]> { return []; }
  async createAiOrderSuggestion(suggestion: InsertAiOrderSuggestion): Promise<AiOrderSuggestion> { throw new Error("Database temporarily unavailable"); }
  async getStoreVisits(): Promise<(StoreVisit & { hardwareStore: HardwareStore; salesRep: SalesRep })[]> { return []; }
  async createStoreVisit(visit: InsertStoreVisit): Promise<StoreVisit> { throw new Error("Database temporarily unavailable"); }
  async getFactorySetups(): Promise<FactorySetup[]> { return []; }
  async getFactorySetup(id: string): Promise<FactorySetup | undefined> { return undefined; }
  async createFactorySetup(factory: InsertFactorySetup): Promise<FactorySetup> { throw new Error("Database temporarily unavailable"); }
  async updateFactorySetup(id: string, factory: Partial<InsertFactorySetup>): Promise<FactorySetup> { throw new Error("Database temporarily unavailable"); }
  async getAiInsights(factoryId?: string): Promise<AiInsight[]> { return []; }
  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> { throw new Error("Database temporarily unavailable"); }
  async getProductionMetrics(factoryId: string): Promise<ProductionMetrics[]> { return []; }
  async createProductionMetrics(metrics: InsertProductionMetrics): Promise<ProductionMetrics> { throw new Error("Database temporarily unavailable"); }
  async getFactoryRecommendations(factoryId: string): Promise<FactoryRecommendation[]> { return []; }
  async createFactoryRecommendation(recommendation: InsertFactoryRecommendation): Promise<FactoryRecommendation> { throw new Error("Database temporarily unavailable"); }
  async getAutomationRules(): Promise<AutomationRule[]> { return []; }
  async getAutomationRule(id: string): Promise<AutomationRule | undefined> { return undefined; }
  async createAutomationRule(rule: InsertAutomationRule): Promise<AutomationRule> { throw new Error("Database temporarily unavailable"); }
  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> { throw new Error("Database temporarily unavailable"); }
  async getAutomationEvents(): Promise<AutomationEvent[]> { return []; }
  async createAutomationEvent(event: InsertAutomationEvent): Promise<AutomationEvent> { throw new Error("Database temporarily unavailable"); }
  async getMaintenanceSchedules(): Promise<MaintenanceSchedule[]> { return []; }
  async createMaintenanceSchedule(schedule: InsertMaintenanceSchedule): Promise<MaintenanceSchedule> { throw new Error("Database temporarily unavailable"); }
  async getPurchaseOrders(): Promise<(PurchaseOrder & { items?: PurchaseOrderItem[] })[]> { return []; }
  async getPurchaseOrder(id: string): Promise<(PurchaseOrder & { items: (PurchaseOrderItem & { product: Product })[]; statusHistory: PoStatusHistory[]; documents: PoDocument[]; }) | undefined> { return undefined; }
  async createPurchaseOrder(order: InsertPurchaseOrder): Promise<PurchaseOrder> { throw new Error("Database temporarily unavailable"); }
  async updatePurchaseOrder(id: string, order: Partial<InsertPurchaseOrder>): Promise<PurchaseOrder> { throw new Error("Database temporarily unavailable"); }
  async addPurchaseOrderItem(item: InsertPurchaseOrderItem): Promise<PurchaseOrderItem> { throw new Error("Database temporarily unavailable"); }
  async updatePurchaseOrderStatus(id: string, status: string, userId?: string, reason?: string, notes?: string): Promise<PurchaseOrder> { throw new Error("Database temporarily unavailable"); }
  async generatePONumber(): Promise<string> { return "PO" + Date.now(); }
  async getPurchaseOrdersByStatus(status: string): Promise<PurchaseOrder[]> { return []; }
  async getPurchaseOrdersByDateRange(startDate: Date, endDate: Date): Promise<PurchaseOrder[]> { return []; }
  async searchPurchaseOrders(query: string): Promise<PurchaseOrder[]> { return []; }
  async addStatusHistory(history: InsertPoStatusHistory): Promise<PoStatusHistory> { throw new Error("Database temporarily unavailable"); }
  async addDocument(document: InsertPoDocument): Promise<PoDocument> { throw new Error("Database temporarily unavailable"); }

  // Methods for Excel uploads integration
  async getExcelUploads(): Promise<any[]> { 
    return [];
  }

  async getHardwareStoresExcel(): Promise<any[]> { 
    return this.hardwareStores;
  }

  async getHardwareStoresFromExcel(): Promise<any[]> { 
    return this.hardwareStores;
  }

  // Import Sessions
  async getImportSessions(): Promise<BulkImportSession[]> {
    return this.getBulkImportSessions();
  }

  async getImportSession(id: string): Promise<BulkImportSession | undefined> {
    return this.getBulkImportSession(id);
  }

  async createImportSession(session: InsertBulkImportSession): Promise<BulkImportSession> {
    return this.createBulkImportSession(session);
  }

  async updateImportSession(id: string, updates: Partial<InsertBulkImportSession>): Promise<BulkImportSession> {
    const existing = this.bulkImportSessions.find(s => s.id === id);
    if (!existing) {
      throw new Error(`Import session ${id} not found`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    
    return this.updateBulkImportSession(id, updated);
  }

  async addFileToImportSession(sessionId: string, file: any): Promise<void> {
    const session = this.bulkImportSessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error(`Import session ${sessionId} not found`);
    }
    
    if (!session.files) {
      session.files = [];
    }
    
    session.files.push(file);
    session.updatedAt = new Date();
    
    console.log(`[Storage] Added file ${file.name} to session ${sessionId}`);
  }

  async updateFileInImportSession(sessionId: string, fileId: string, updates: any): Promise<void> {
    const session = this.bulkImportSessions.find(s => s.id === sessionId);
    if (!session || !session.files) {
      throw new Error(`Import session ${sessionId} or files not found`);
    }
    
    const fileIndex = session.files.findIndex((f: any) => f.id === fileId);
    if (fileIndex === -1) {
      throw new Error(`File ${fileId} not found in session ${sessionId}`);
    }
    
    session.files[fileIndex] = {
      ...session.files[fileIndex],
      ...updates
    };
    
    session.updatedAt = new Date();
    
    console.log(`[Storage] Updated file ${fileId} in session ${sessionId}`);
  }

  async processHardwareStoreRow(row: any, filename: string): Promise<any> {
    try {
      // Detect store information from various possible column formats
      const storeId = `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Try to extract store data from common column patterns
      const storeName = row['Store Name'] || row['STORE NAME'] || row['Name'] || row['STORE'] || 
                       row['Customer Name'] || row['CLIENT NAME'] || row['Business Name'] || '';
      
      if (!storeName || storeName.toString().trim().length === 0) {
        return null; // Skip rows without store names
      }

      const storeData: InsertHardwareStore = {
        id: storeId,
        name: storeName.toString().trim(),
        address: (row['Address'] || row['ADDRESS'] || row['Location'] || '').toString().trim(),
        city: (row['City'] || row['CITY'] || row['Town'] || '').toString().trim(),
        province: (row['Province'] || row['PROVINCE'] || row['Region'] || '').toString().trim(),
        postalCode: (row['Postal Code'] || row['ZIP'] || row['CODE'] || '').toString().trim(),
        phone: (row['Phone'] || row['PHONE'] || row['Contact'] || '').toString().trim(),
        email: (row['Email'] || row['EMAIL'] || '').toString().trim(),
        ownerName: (row['Owner'] || row['OWNER'] || row['Manager'] || '').toString().trim(),
        storeSize: (row['Size'] || row['STORE SIZE'] || 'medium').toString().toLowerCase(),
        creditLimit: parseFloat(row['Credit Limit'] || row['CREDIT'] || '50000') || 50000,
        currentBalance: parseFloat(row['Balance'] || row['BALANCE'] || '0') || 0,
        gpsCoordinates: (row['GPS'] || row['Coordinates'] || '').toString().trim(),
        isActive: true,
        source: filename,
        notes: `Imported from ${filename} on ${new Date().toISOString()}`
      };

      // Store hardware store
      const created = await this.createHardwareStore(storeData);
      
      console.log(`[Storage] Processed hardware store: ${storeData.name}`);
      return created;
    } catch (error) {
      console.error(`[Storage] Error processing hardware store row:`, error);
      throw new Error(`Failed to process store data: ${error.message}`);
    }
  }

  async getSalesRepRoutesFromExcel(): Promise<any[]> {
    return [];
  }

  async createHardwareStoreFromExcel(store: InsertHardwareStore): Promise<HardwareStore> {
    return this.createHardwareStore(store);
  }

  async syncStoreToMainDirectory(store: any): Promise<void> {
    console.log(`[Storage] Syncing store ${store.name} to main directory`);
  }

  async syncRouteToMainDirectory(route: any): Promise<void> {
    console.log(`[Storage] Syncing route ${route.id} to main directory`);
  }

  // Company Settings - Database Integration
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    const [settings] = await db.select().from(companySettings).limit(1);
    return settings || undefined;
  }

  async updateCompanySettings(settingsUpdate: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    // Try to update existing settings first
    const existing = await this.getCompanySettings();
    
    if (existing) {
      const [updated] = await db.update(companySettings)
        .set({ ...settingsUpdate, updatedAt: new Date() })
        .where(eq(companySettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new settings if none exist (for Homemart Africa)
      const [created] = await db.insert(companySettings).values({
        userId: "homemart_admin_001",
        companyName: "HOMEMART AFRICA",
        companyRegistration: "2022/854581/07",
        contactEmail: "admin@homemart.co.za",
        phone: "+27 11 555 0000",
        address: "123 Industrial Drive",
        city: "Johannesburg",
        province: "Gauteng",
        country: "South Africa",
        postalCode: "2000",
        vatNumber: "9169062271",
        creditLimit: "500000.00",
        paymentTerms: "30_days",
        businessType: "distributor",
        ...settingsUpdate,
      }).returning();
      return created;
    }
  }
  
  // User Management - Database Integration
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isActive, true)).orderBy(asc(users.firstName), asc(users.lastName));
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, userUpdate: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users)
      .set({ ...userUpdate, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await db.update(users)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(users.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Audit Trail - Database Integration
  async getAuditLogs(filters?: any): Promise<UserAuditTrail[]> {
    let query = db.select().from(userAuditTrail);
    
    if (filters?.userId) {
      query = query.where(eq(userAuditTrail.userId, filters.userId));
    }
    if (filters?.action) {
      query = query.where(eq(userAuditTrail.action, filters.action));
    }
    if (filters?.dateFrom && filters.dateTo) {
      query = query.where(
        and(
          gte(userAuditTrail.timestamp, filters.dateFrom),
          lte(userAuditTrail.timestamp, filters.dateTo)
        )
      );
    }
    
    return await query.orderBy(desc(userAuditTrail.timestamp)).limit(1000);
  }

  async createAuditLog(log: InsertUserAuditTrail): Promise<UserAuditTrail> {
    const [created] = await db.insert(userAuditTrail).values({
      userId: log.userId,
      action: log.action,
      details: log.details,
      ipAddress: log.ipAddress || '127.0.0.1',
      userAgent: log.userAgent || 'Unknown',
      timestamp: new Date()
    }).returning();
    return created;
  }

  // Product Labeling System - Database implementation
  async getProductLabels(): Promise<ProductLabel[]> {
    return await db.select().from(productLabels).orderBy(desc(productLabels.createdAt));
  }

  async getProductLabel(id: string): Promise<ProductLabel | undefined> {
    const [label] = await db.select().from(productLabels).where(eq(productLabels.id, id));
    return label || undefined;
  }

  async createProductLabel(labelData: InsertProductLabel): Promise<ProductLabel> {
    const [label] = await db.insert(productLabels).values(labelData).returning();
    return label;
  }

  async updateProductLabel(id: string, labelData: Partial<InsertProductLabel>): Promise<ProductLabel> {
    const [label] = await db.update(productLabels).set(labelData).where(eq(productLabels.id, id)).returning();
    return label;
  }

  async deleteProductLabel(id: string): Promise<boolean> {
    const result = await db.delete(productLabels).where(eq(productLabels.id, id));
    return result.rowCount > 0;
  }

  // Printer Methods - Database implementation  
  async getPrinters(): Promise<Printer[]> {
    return await db.select().from(printers).orderBy(asc(printers.name));
  }

  async getPrinter(id: string): Promise<Printer | undefined> {
    const [printer] = await db.select().from(printers).where(eq(printers.id, id));
    return printer || undefined;
  }

  async createPrinter(printerData: InsertPrinter): Promise<Printer> {
    const [printer] = await db.insert(printers).values(printerData).returning();
    return printer;
  }

  async updatePrinter(id: string, printerData: Partial<InsertPrinter>): Promise<Printer> {
    const [printer] = await db.update(printers).set(printerData).where(eq(printers.id, id)).returning();
    return printer;
  }

  async deletePrinter(id: string): Promise<boolean> {
    const result = await db.delete(printers).where(eq(printers.id, id));
    return result.rowCount > 0;
  }

  // Print Job Methods - Database implementation
  async getPrintJobs(): Promise<PrintJob[]> {
    return await db.select().from(printJobs).orderBy(desc(printJobs.createdAt));
  }

  async getPrintJob(id: string): Promise<PrintJob | undefined> {
    const [job] = await db.select().from(printJobs).where(eq(printJobs.id, id));
    return job || undefined;
  }

  async getPrintJobsByPrinter(printerId: string): Promise<PrintJob[]> {
    return await db.select().from(printJobs).where(eq(printJobs.printerId, printerId)).orderBy(desc(printJobs.createdAt));
  }

  async getPrintJobsByUser(userId: string): Promise<PrintJob[]> {
    return await db.select().from(printJobs).where(eq(printJobs.userId, userId)).orderBy(desc(printJobs.createdAt));
  }

  async createPrintJob(jobData: InsertPrintJob): Promise<PrintJob> {
    const [job] = await db.insert(printJobs).values(jobData).returning();
    return job;
  }

  async updatePrintJobStatus(id: string, status: string): Promise<PrintJob> {
    const [job] = await db.update(printJobs).set({ status }).where(eq(printJobs.id, id)).returning();
    return job;
  }

  // Label Template Methods - Database implementation
  async getLabelTemplates(): Promise<LabelTemplate[]> {
    return await db.select().from(labelTemplates).orderBy(asc(labelTemplates.name));
  }

  async getLabelTemplate(id: string): Promise<LabelTemplate | undefined> {
    const [template] = await db.select().from(labelTemplates).where(eq(labelTemplates.id, id));
    return template || undefined;
  }

  async createLabelTemplate(templateData: InsertLabelTemplate): Promise<LabelTemplate> {
    const [template] = await db.insert(labelTemplates).values(templateData).returning();
    return template;
  }

  // Bulk Import Sessions - Database implementation
  async getBulkImportSessions(): Promise<BulkImportSession[]> {
    return await db.select().from(bulkImportSessions).orderBy(desc(bulkImportSessions.createdAt)).limit(10);
  }

  async getBulkImportSession(sessionId: string): Promise<BulkImportSession | undefined> {
    const [session] = await db.select().from(bulkImportSessions).where(eq(bulkImportSessions.id, sessionId));
    return session || undefined;
  }

  async createBulkImportSession(session: InsertBulkImportSession): Promise<BulkImportSession> {
    const [newSession] = await db.insert(bulkImportSessions).values(session).returning();
    return newSession;
  }

  async updateBulkImportSession(sessionId: string, sessionData: BulkImportSession): Promise<BulkImportSession> {
    const [updated] = await db.update(bulkImportSessions)
      .set({
        status: sessionData.status,
        processedFiles: sessionData.processedFiles,
        totalImported: sessionData.totalImported,
        files: sessionData.files as any, // Cast to handle JSON type
        updatedAt: new Date()
      })
      .where(eq(bulkImportSessions.id, sessionId))
      .returning();
    return updated;
  }

  // AI-Powered Mood Selector System Implementation
  async getUserMoodPreferences(userId: string): Promise<UserMoodPreference[]> {
    return await db
      .select()
      .from(userMoodPreferences)
      .where(eq(userMoodPreferences.userId, userId))
      .orderBy(desc(userMoodPreferences.usageCount), desc(userMoodPreferences.lastUsed));
  }

  async getUserMoodPreference(userId: string, moodId: string): Promise<UserMoodPreference | undefined> {
    const [preference] = await db
      .select()
      .from(userMoodPreferences)
      .where(and(
        eq(userMoodPreferences.userId, userId),
        eq(userMoodPreferences.moodId, moodId)
      ));
    return preference;
  }

  async createUserMoodPreference(preference: InsertUserMoodPreference): Promise<UserMoodPreference> {
    const [created] = await db
      .insert(userMoodPreferences)
      .values(preference)
      .returning();
    return created;
  }

  async updateUserMoodPreference(id: string, preference: Partial<InsertUserMoodPreference>): Promise<UserMoodPreference> {
    const [updated] = await db
      .update(userMoodPreferences)
      .set({ ...preference, updatedAt: new Date() })
      .where(eq(userMoodPreferences.id, id))
      .returning();
    return updated;
  }

  async deleteUserMoodPreference(id: string): Promise<boolean> {
    const result = await db
      .delete(userMoodPreferences)
      .where(eq(userMoodPreferences.id, id));
    return result.rowCount > 0;
  }

  async getUserMoodHistory(
    userId: string, 
    filters?: { limit?: number; moodId?: string; timeRange?: { start: Date; end: Date } }
  ): Promise<UserMoodHistory[]> {
    let query = db
      .select()
      .from(userMoodHistory)
      .where(eq(userMoodHistory.userId, userId));

    if (filters?.moodId) {
      query = query.where(eq(userMoodHistory.moodId, filters.moodId));
    }

    if (filters?.timeRange) {
      query = query.where(and(
        gte(userMoodHistory.timestamp, filters.timeRange.start),
        lte(userMoodHistory.timestamp, filters.timeRange.end)
      ));
    }

    query = query.orderBy(desc(userMoodHistory.timestamp));

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return await query;
  }

  async createUserMoodHistory(history: InsertUserMoodHistory): Promise<UserMoodHistory> {
    const [created] = await db
      .insert(userMoodHistory)
      .values(history)
      .returning();
    return created;
  }

  async getAiMoodAnalytics(userId: string, analysisType?: string): Promise<AiMoodAnalytics[]> {
    let query = db
      .select()
      .from(aiMoodAnalytics)
      .where(eq(aiMoodAnalytics.userId, userId));

    if (analysisType) {
      query = query.where(eq(aiMoodAnalytics.analysisType, analysisType));
    }

    return await query.orderBy(desc(aiMoodAnalytics.generatedAt));
  }

  async createAiMoodAnalytics(analytics: InsertAiMoodAnalytics): Promise<AiMoodAnalytics> {
    const [created] = await db
      .insert(aiMoodAnalytics)
      .values(analytics)
      .returning();
    return created;
  }

  async findUsersByMoodPattern(pattern: { 
    moodId?: string; 
    timeOfDay?: string; 
    dayOfWeek?: string 
  }): Promise<User[]> {
    let historyQuery = db
      .select({ userId: userMoodHistory.userId })
      .from(userMoodHistory);

    const conditions = [];
    if (pattern.moodId) {
      conditions.push(eq(userMoodHistory.moodId, pattern.moodId));
    }
    if (pattern.timeOfDay) {
      conditions.push(eq(userMoodHistory.timeOfDay, pattern.timeOfDay));
    }
    if (pattern.dayOfWeek) {
      conditions.push(eq(userMoodHistory.dayOfWeek, pattern.dayOfWeek));
    }

    if (conditions.length > 0) {
      historyQuery = historyQuery.where(and(...conditions));
    }

    const userIds = await historyQuery;
    const uniqueUserIds = [...new Set(userIds.map(row => row.userId))];

    if (uniqueUserIds.length === 0) {
      return [];
    }

    return await db
      .select()
      .from(users)
      .where(sql`${users.id} IN ${uniqueUserIds}`);
  }

  async updateMoodUsageStats(userId: string, moodId: string): Promise<void> {
    // First try to update existing preference
    const existingPreference = await this.getUserMoodPreference(userId, moodId);
    
    if (existingPreference) {
      await db
        .update(userMoodPreferences)
        .set({
          usageCount: sql`${userMoodPreferences.usageCount} + 1`,
          lastUsed: new Date(),
          updatedAt: new Date()
        })
        .where(eq(userMoodPreferences.id, existingPreference.id));
    } else {
      // Create new preference if it doesn't exist
      await this.createUserMoodPreference({
        userId,
        moodId,
        moodName: moodId,
        energyLevel: 50,
        focusLevel: 50,
        creativityLevel: 50,
        usageCount: 1,
        lastUsed: new Date()
      });
    }
  }
}

export const storage = new DatabaseStorage();
