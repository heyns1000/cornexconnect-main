import { 
  users, products, inventory, distributors, orders, orderItems, 
  productionSchedule, demandForecast, salesMetrics, brands,
  salesReps, hardwareStores, routePlans, routeStores, aiOrderSuggestions, storeVisits,
  factorySetups, aiInsights, productionMetrics, factoryRecommendations,
  automationRules, automationEvents, maintenanceSchedules,
  type User, type InsertUser, type Product, type InsertProduct,
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
  type MaintenanceSchedule, type InsertMaintenanceSchedule
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, asc, and, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
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
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
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

  // Excel Upload
  async getExcelUploads(): Promise<any[]> {
    const { excelUploads } = await import("@shared/schema");
    const { desc } = await import("drizzle-orm");
    return await db.select().from(excelUploads)
      .orderBy(desc(excelUploads.uploadedAt));
  }

  async createExcelUpload(upload: any): Promise<any> {
    const { excelUploads } = await import("@shared/schema");
    const [newUpload] = await db.insert(excelUploads).values(upload).returning();
    return newUpload;
  }

  async updateExcelUpload(id: string, updates: any): Promise<any> {
    const { excelUploads } = await import("@shared/schema");
    const [updated] = await db.update(excelUploads)
      .set(updates)
      .where(eq(excelUploads.id, id))
      .returning();
    return updated;
  }

  async createHardwareStoreFromExcel(store: any): Promise<any> {
    const { hardwareStoresFromExcel } = await import("@shared/schema");
    const [newStore] = await db.insert(hardwareStoresFromExcel).values(store).returning();
    return newStore;
  }

  async createSalesRepRouteFromExcel(route: any): Promise<any> {
    const { salesRepRoutesFromExcel } = await import("@shared/schema");
    const [newRoute] = await db.insert(salesRepRoutesFromExcel).values(route).returning();
    return newRoute;
  }

  async getHardwareStoresFromExcel(): Promise<any[]> {
    const { hardwareStoresFromExcel } = await import("@shared/schema");
    const { desc } = await import("drizzle-orm");
    return await db.select().from(hardwareStoresFromExcel)
      .orderBy(desc(hardwareStoresFromExcel.createdAt));
  }

  async getSalesRepRoutesFromExcel(): Promise<any[]> {
    const { salesRepRoutesFromExcel } = await import("@shared/schema");
    const { desc } = await import("drizzle-orm");
    return await db.select().from(salesRepRoutesFromExcel)
      .orderBy(desc(salesRepRoutesFromExcel.createdAt));
  }
}

export const storage = new DatabaseStorage();
