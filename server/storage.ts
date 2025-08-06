import { 
  users, products, inventory, distributors, orders, orderItems, 
  productionSchedule, demandForecast, salesMetrics, brands,
  salesReps, hardwareStores, routePlans, routeStores, aiOrderSuggestions, storeVisits,
  factorySetups, aiInsights, productionMetrics, factoryRecommendations,
  automationRules, automationEvents, maintenanceSchedules,
  excelUploads, hardwareStoresFromExcel, salesRepRoutesFromExcel,
  purchaseOrders, purchaseOrderItems, poStatusHistory, poDocuments,
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
  type PoDocument, type InsertPoDocument
} from "@shared/schema";
import { db } from "./db";
import { eq, sql, desc, asc, and, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
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
        .where(eq(hardwareStores.name, excelStore.storeName))
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

export const storage = new DatabaseStorage();
