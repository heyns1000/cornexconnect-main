import { 
  users, products, inventory, distributors, orders, orderItems, 
  productionSchedule, demandForecast, salesMetrics, brands,
  type User, type InsertUser, type Product, type InsertProduct,
  type Inventory, type InsertInventory, type Distributor, type InsertDistributor,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type ProductionSchedule, type InsertProductionSchedule,
  type DemandForecast, type InsertDemandForecast,
  type SalesMetrics, type InsertSalesMetrics,
  type Brand, type InsertBrand
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
    return await db.select()
      .from(inventory)
      .innerJoin(products, eq(inventory.productId, products.id))
      .where(eq(products.isActive, true));
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
    return await db.select()
      .from(orders)
      .innerJoin(distributors, eq(orders.distributorId, distributors.id))
      .orderBy(desc(orders.createdAt));
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
      items
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
    return await db.select()
      .from(productionSchedule)
      .innerJoin(products, eq(productionSchedule.productId, products.id))
      .orderBy(asc(productionSchedule.scheduledDate));
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
    return await db.select()
      .from(productionSchedule)
      .innerJoin(products, eq(productionSchedule.productId, products.id))
      .where(
        and(
          gte(productionSchedule.scheduledDate, startDate),
          lte(productionSchedule.scheduledDate, endDate)
        )
      )
      .orderBy(asc(productionSchedule.scheduledDate));
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

    return await query.orderBy(desc(demandForecast.forecastDate));
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
}

export const storage = new DatabaseStorage();
